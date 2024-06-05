const userHandler = require('../handler/userHandler');

const userRoute = {
    method: 'POST',
    path: '/user',
    handler: userHandler
};

module.exports = userRoute;
