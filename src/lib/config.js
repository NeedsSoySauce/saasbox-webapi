const { withMiddleWare, cors } = require('./middleware');

function withDefaultMiddleWare(func) {
    return withMiddleWare(func, [], [cors]);
}

module.exports = {
    withDefaultMiddleWare
}