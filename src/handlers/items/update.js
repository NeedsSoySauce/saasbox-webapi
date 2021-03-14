const ItemsRepo = require('../../data/itemsRepo.js');
const { withDefaultMiddleWare } = require('../../lib/config.js');
const Item = require('../../models/item.js');
const StorageService = require('../../services/storage.js');

const storageService = new StorageService();
const itemsRepo = new ItemsRepo(storageService);

const handler = async (event) => {
    const userId = event.requestContext.authorizer.userId;
    const body = JSON.parse(event.body);
    const id = event.pathParameters.id;

    const item = await itemsRepo.getItem(userId, id);

    if (item === null) {
        return {
            statusCode: 404
        };
    }

    const updatedItem = await itemsRepo.updateItem(item, body.content);

    const response = {
        statusCode: 201,
        body: JSON.stringify(updatedItem)
    };

    return response;
};

exports.updateItemHandler = withDefaultMiddleWare(handler);
