const Item = require('../../models/item.js');
const ItemsRepo = require('../../data/itemsRepo.js');
const StorageService = require('../../services/storage.js');
const { withDefaultMiddleWare } = require('../../lib/config.js');

const storageService = new StorageService();
const itemsRepo = new ItemsRepo(storageService);

const handler = async (event) => {
    const userId = event.requestContext.authorizer.userId;

    let body = null;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return {
            statusCode: 400
        };
    }

    if (typeof body !== 'object' || Array.isArray(body)) {
        return {
            statusCode: 400
        };
    }

    let item;
    try {
        item = await itemsRepo.addItem(new Item(null, userId, null), body.content);
    } catch (e) {
        console.error(JSON.stringify(e));
        return {
            statusCode: 500
        };
    }

    return {
        statusCode: 201,
        headers: {
            Location: item.url
        },
        body: JSON.stringify(item)
    };
};

exports.createItemHandler = withDefaultMiddleWare(handler);
