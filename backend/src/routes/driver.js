const express = require('express');
const authRequired = require('../middleware/auth');
const { applyForDriver } = require('../controllers/driverController');

const router = express.Router();

// Driver application route (authenticated user)
router.post('/apply', authRequired, applyForDriver);

module.exports = router;

