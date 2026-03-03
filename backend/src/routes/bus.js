const express = require('express');
const {
  getPrivateBusOptions,
  getRouteDetails,
  getBusById,
} = require('../controllers/busController');

const router = express.Router();

// Private bus options for a route
router.get('/private-options', getPrivateBusOptions);

// Route details including polyline
router.get('/route/:routeId', getRouteDetails);

// Bus details by id (includes routeId)
router.get('/:busId', getBusById);

module.exports = router;
