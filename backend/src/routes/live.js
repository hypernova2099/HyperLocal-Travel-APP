const express = require('express');
const authRequired = require('../middleware/auth');
const { driverOnly } = require('../middleware/roles');
const { updateLiveLocation, getLiveLocation } = require('../controllers/liveController');

const router = express.Router();

// Driver-only endpoint to update live location
router.post('/update', authRequired, driverOnly, updateLiveLocation);

// Public endpoint to get live location of a bus
router.get('/:busId', getLiveLocation);

module.exports = router;

