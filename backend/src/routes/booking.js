const express = require('express');
const authRequired = require('../middleware/auth');
const { userOnly } = require('../middleware/roles');
const { createBooking } = require('../controllers/bookingController');

const router = express.Router();

// Create a booking (authenticated user role only)
router.post('/', authRequired, userOnly, createBooking);

module.exports = router;

