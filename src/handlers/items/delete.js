const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.deleteItemHandler = async (event) => {
    const userId = event.requestContext.authorizer.userId;
    const id = event.pathParameters.id;

    const key = {
        id: userId,
        sid: 'item_' + id
    }

    await docClient.delete({
        TableName: tableName,
        Key: key
    }).promise();

    const response = {
        statusCode: 204
    };

    return response;
}
