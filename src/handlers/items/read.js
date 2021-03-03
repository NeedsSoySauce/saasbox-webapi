const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.readItemHandler = async (event) => {
    const id = event.pathParameters?.id;

    if (id) {
        let result = await docClient.get({
            TableName: tableName,
            Key: { id }
        }).promise();
        return createResponse(result.Item, result.Item ? 200 : 404);
    } else {
        let result = await docClient.scan({
            TableName: tableName,
            Limit: 10
        }).promise();
        return createResponse(result.Items, 200);
    }
}

function createResponse(result, statusCode) {
    return {
        statusCode,
        body: JSON.stringify(result)
    };
}