const { v4: uuidv4 } = require('uuid');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const StorageService = require('../services/storage');
const Item = require('../models/item');

const tableName = process.env.DYNAMODB_TABLE;

class ItemsRepo {
    /**
     * @param {StorageService} storageService
     */
    constructor(storageService) {
        this.storageService = storageService;
    }

    /**
     * Adds the given item to this repository.
     *
     * @param {Item} item The item to add.
     * @param {string} content The content of the item being added.
     * @returns {Promise<Item>} A new fully populated item.
     */
    async addItem(item, content) {
        const id = item.id ?? uuidv4();

        let url;
        try {
            url = await this.storageService.uploadText(content, id);
        } catch (e) {
            throw Error('Failed to upload content.');
        }

        const newItem = new Item(id, item.userId, url);

        const result = await docClient
            .put({
                TableName: tableName,
                Item: {
                    pk: Item.Meta.generatePartitionKey(newItem),
                    sk: Item.Meta.generateSortKey(newItem),
                    ...newItem
                },
                ConditionExpression: 'attribute_not_exists(pk) and attribute_not_exists(sk)'
            })
            .promise();

        if (result.$response.error) {
            throw Error('Failed to add item.');
        }

        return newItem;
    }

    /**
     * Updates the given item in this repository.
     *
     * @param {Item} item The item to update (only the id and userId are required).
     * @param {Item} newItem The new item (the id and userId cannot be changed).
     * @param {string} content The content for the new item or null if it's unchanged.
     * @returns {Promise<Item>} A new item with the updated value(s).
     */
    async updateItem(item, newItem, content) {
        const id = item.id;

        let url = item.url;
        if (content) {
            try {
                url = await this.storageService.uploadText(content, id);
            } catch (e) {
                throw Error('Failed to upload content.');
            }
        }

        const updatedItem = new Item(id, item.userId, url);

        const result = await docClient
            .put({
                TableName: tableName,
                Item: {
                    pk: Item.Meta.generatePartitionKey(updatedItem),
                    sk: Item.Meta.generateSortKey(updatedItem),
                    ...updatedItem
                },
                ConditionExpression: 'attribute_exists(pk) and attribute_exists(sk)'
            })
            .promise();

        if (result.$response.error) {
            // TODO: The old record will still reference the previous version of it's content in the database, so
            // there's no issues there, but we may want to delete the new version.
            throw Error('Failed to update item.');
        }

        return updatedItem;
    }

    /**
     * @param {string} userId
     * @returns {Item[]} An array of items with the given userId.
     */
    async getItems(userId) {
        // #TODO: implement pagination
        const result = await docClient
            .query({
                TableName: tableName,
                Limit: 10,
                KeyConditionExpression: `pk = :userId and begins_with(sk, :prefix)`,
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':prefix': 'item_'
                },
                ProjectionExpression: 'id, userId, #url',
                ExpressionAttributeNames: {
                    '#url': 'url'
                }

            })
            .promise();

        if (result.$response.error) {
            throw Error(`Failed to get items. UserId = ${userId}`);
        }

        return result.Items ?? [];
    }

    /**
     * @param {string} userId
     * @param {string} itemId
     * @returns {Item} The item with the given userId and item id, or null if no such item exists.
     */
    async getItem(userId, itemId) {
        const item = new Item(itemId, userId, null);

        const result = await docClient
            .get({
                TableName: tableName,
                Key: {
                    pk: Item.Meta.generatePartitionKey(item),
                    sk: Item.Meta.generateSortKey(item)
                },
                ProjectionExpression: 'id, userId, #url',
                ExpressionAttributeNames: {
                    '#url': 'url'
                }
            })
            .promise();

        if (result.$response.error) {
            throw Error(`Failed to get item. UserId = ${userId}, ItemId = ${itemId}`);
        }

        return result.Item ?? null;
    }

    /**
     * @param {string} userId
     * @param {string} itemId
     */
    async deleteItem(userId, itemId) {
        const item = new Item(itemId, userId, null);

        await this.storageService.deleteText(itemId);

        const result = await docClient
            .delete({
                TableName: tableName,
                Key: {
                    pk: Item.Meta.generatePartitionKey(item),
                    sk: Item.Meta.generateSortKey(item)
                }
            })
            .promise();

        if (result.$response.error) {
            throw Error(`Failed to delete item. UserId = ${userId}, ItemId = ${itemId}`);
        }
    }
}

module.exports = ItemsRepo;
