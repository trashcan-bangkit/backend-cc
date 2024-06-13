const express = require('express');
const { getNearestWasteBank } = require('./handler');

const router = express.Router();

router.get('/nearest-waste-bank', getNearestWasteBank);

module.exports = router;
