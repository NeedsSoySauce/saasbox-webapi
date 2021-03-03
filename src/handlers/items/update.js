const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.updateItemHandler = async (event) => {
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id;
    const item = { ...body, id }

    await docClient.put({
        TableName: tableName,
        Item: item,
        ConditionExpression: "attribute_exists(id)"
    }).promise();

    const response = {
        statusCode: 201,
        body: JSON.stringify(item)
    };

    return response;
}
