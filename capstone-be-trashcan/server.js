const Hapi = require('@hapi/hapi');
const admin = require('firebase-admin');
const serviceAccount = require('./trashcan-1e54a-firebase-adminsdk-bmm8g-6a60b5925e.json');
const dotenv = require('dotenv');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

dotenv.config();

const init = async () => {
    const server = Hapi.server({
        port: 8080,
        host: '0.0.0.0'
    });

    // routes
    const userRoute = require('./src/route/userRoute');
    server.route(userRoute);

    const geomapRoutes = require('./src/route/geomapRoute');
    server.route(geomapRoutes);

    const recommendRoutes = require('./src/route/recommendRoute');
    server.route(recommendRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
