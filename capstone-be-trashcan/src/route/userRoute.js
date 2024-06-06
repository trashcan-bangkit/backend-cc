const {
    signupHandler,
    signinHandler,
    profileHandler,
    verifyToken
} = require('../handler/userHandler');

const userRoutes = [
    {
        method: 'POST',
        path: '/signup',
        handler: signupHandler
    },
    {
        method: 'POST',
        path: '/signin',
        handler: signinHandler
    },
    {
        method: 'GET',
        path: '/profile',
        handler: profileHandler,
        options: {
            pre: [{ method: verifyToken }]
        }
    }
];

module.exports = userRoutes;
