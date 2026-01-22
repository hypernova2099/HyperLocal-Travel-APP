const express = require('express');
const { getPrivateBusOptions, getRouteDetails } = require('../controllers/busController');

const router = express.Router();

router.get('/private-options', getPrivateBusOptions);
router.get('/routes/:routeId', getRouteDetails);

module.exports = router;
