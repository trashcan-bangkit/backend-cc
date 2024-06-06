const Hapi = require('@hapi/hapi');
const admin = require('firebase-admin');
const serviceAccount = require('../capstone-be-trashcan/trashcan-1e54a-firebase-adminsdk-bmm8g-6a60b5925e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // routes
    const userRoute = require('./src/route/userRoute');
    server.route(userRoute);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();