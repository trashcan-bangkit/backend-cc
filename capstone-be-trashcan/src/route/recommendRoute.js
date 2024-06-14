const handlers = require('../handler/recommendHandler');

module.exports = [
    {
        method: 'POST',
        path: '/recommend',
        options: {
            payload: {
                parse: true,
                multipart: {
                    output: 'stream'
                },
             maxBytes: 1000 * 1000 * 5, // 5 Mb
            }
        },
        handler: handlers.handleRecommend
    }
];