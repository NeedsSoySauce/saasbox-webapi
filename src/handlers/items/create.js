const { v4: uuidv4 } = require('uuid');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const tableName = process.env.DYNAMODB_TABLE;

exports.createItemHandler = async (event) => {
    const userId = event.requestContext.authorizer.userId;

    let body = null;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return {
            statusCode: 400
        }
    }

    if (typeof body !== 'object' || Array.isArray(body)) {
        return {
            statusCode: 400
        }
    }

    const item = {
        ...body,
        id: userId,
        sid: 'item_' + uuidv4()
    }

    await docClient.put({
        TableName: tableName,
        Item: item,
        ConditionExpression: "attribute_not_exists(id) and attribute_not_exists(sid)"
    }).promise();

    const response = {
        statusCode: 201,
        body: JSON.stringify(item)
    };

    return response;
}
