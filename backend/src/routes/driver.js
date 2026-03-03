const express = require('express');
const authRequired = require('../middleware/auth');
const { driverOnly } = require('../middleware/roles');
const { applyForDriver, getAssignedBus } = require('../controllers/driverController');

const router = express.Router();

// Driver application route (authenticated user)
router.post('/apply', authRequired, applyForDriver);

// Get assigned bus for current driver
router.get('/assigned-bus', authRequired, driverOnly, getAssignedBus);

module.exports = router;

