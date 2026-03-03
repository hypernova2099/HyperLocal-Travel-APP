const express = require('express');
const { getEmergencyPoints } = require('../controllers/emergencyController');

const router = express.Router();

// Public emergency points endpoint used by Safety screen
router.get('/', getEmergencyPoints);

module.exports = router;

