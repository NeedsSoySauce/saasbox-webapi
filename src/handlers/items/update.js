const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.updateItemHandler = async (event) => {
    const userId = event.requestContext.authorizer.userId;
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id;

    const item = {
        ...body,
        id: userId,
        sid: 'item_' + id
    }

    await docClient.put({
        TableName: tableName,
        Item: item,
        ConditionExpression: "attribute_exists(id) and attribute_exists(sid)"
    }).promise();

    const response = {
        statusCode: 201,
        body: JSON.stringify(item)
    };

    return response;
}
