const { v4: uuidv4 } = require('uuid');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.createItemHandler = async (event) => {
    const body = JSON.parse(event.body)
    const item = { ...body, id: uuidv4() }

    await docClient.put({
        TableName: tableName,
        Item: item,
        ConditionExpression: "attribute_not_exists(id)"
    }).promise();

    const response = {
        statusCode: 201,
        body: JSON.stringify(item)
    };

    return response;
}
