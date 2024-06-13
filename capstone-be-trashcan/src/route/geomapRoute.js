const Hapi = require('@hapi/hapi');
const { getNearestWasteBank } = require('../handler/geomapHandler');

const routes = [
    {
        method: 'GET',
        path: '/banksampah-terdekat',
        handler: getNearestWasteBank
    }
];

module.exports = routes;


