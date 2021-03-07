class Item {
    static Meta = class {
        static prefix = 'item_';

        static generatePartitionKey(item) {
            return item.userId;
        }

        static generateSortKey(item) {
            return Item.Meta.prefix + item.id;
        }
    };

    constructor(id, userId, url) {
        this.id = id;
        this.userId = userId;
        this.url = url;
    }
}

module.exports = Item;
