const Item = require('../../models/item.js');
const ItemsRepo = require('../../data/itemsRepo.js');
const StorageService = require('../../services/storage.js');

const storageService = new StorageService();
const itemsRepo = new ItemsRepo(storageService);

exports.deleteItemHandler = async (event) => {
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
