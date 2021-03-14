const ItemsRepo = require('../../data/itemsRepo.js');
const { withDefaultMiddleWare } = require('../../lib/config.js');
const StorageService = require('../../services/storage.js');

const storageService = new StorageService();
const itemsRepo = new ItemsRepo(storageService);

const handler = async (event) => {
    const userId = event.requestContext.authorizer.userId;
    const id = event.pathParameters?.id;

    if (id) {
        let item = await itemsRepo.getItem(userId, id);
        return createResponse(item, item ? 200 : 404);
    } else {
        let items = await itemsRepo.getItems(userId);
        return createResponse(items, 200);
    }
};

function createResponse(result, statusCode) {
    return {
        statusCode,
        body: result ? JSON.stringify(result) : null
    };
}

exports.readItemHandler = withDefaultMiddleWare(handler);
