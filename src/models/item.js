const Model = require('./model.js');

class Item extends Model {
    static ITEM_PREFIX = 'item_';

    id;
    userId;
    url;

    constructor(id, userId, url) {
        super(userId, Item.ITEM_PREFIX + id);
        this.id = id;
        this.userId = userId;
        this.url = url;
    }
}

module.exports = Item;
