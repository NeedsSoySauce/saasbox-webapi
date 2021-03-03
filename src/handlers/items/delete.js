const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.deleteItemHandler = async (event) => {
    const id = event.pathParameters.id;

    await docClient.delete({
        TableName: tableName,
        Key: { id }
    }).promise();

    const response = {
        statusCode: 204
    };

    return response;
}
