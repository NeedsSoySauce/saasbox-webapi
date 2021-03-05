const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.readItemHandler = async (event) => {
    const userId = event.requestContext.authorizer.userId;
    const id = event.pathParameters?.id;

    if (id) {
        if (!id.startsWith(userId))
            return createResponse(null, 404);

        let result = await docClient.get({
            TableName: tableName,
            Key: { id }
        }).promise();
        return createResponse(result.Item, result.Item ? 200 : 404);
    } else {
        let result = await docClient.query({
            TableName: tableName,
            Limit: 10,
            KeyConditionExpression: `id = :userId and begins_with(sid, :prefix)`,
            ExpressionAttributeValues: {
                ":userId": userId,
                ":prefix": "item_"
            }
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