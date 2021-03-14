const ItemsRepo = require('../../data/itemsRepo.js');
const { withDefaultMiddleWare } = require('../../lib/config.js');
const StorageService = require('../../services/storage.js');

const storageService = new StorageService();
const itemsRepo = new ItemsRepo(storageService);

const handler = async (event) => {
    const userId = event.requestContext.authorizer.userId;
    const id = event.pathParameters.id;

    try {
        await itemsRepo.deleteItem(userId, id);
    } catch (e) {
        return {
            statusCode: 500
        };
    }

    return {
        statusCode: 204
    };
};

exports.deleteItemHandler = withDefaultMiddleWare(handler);
