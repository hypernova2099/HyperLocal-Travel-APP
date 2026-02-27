const express = require('express');
const authRequired = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');
const {
  getPendingDriverRequests,
  approveDriver,
  rejectDriver,
} = require('../controllers/adminController');

const router = express.Router();

// Admin: list pending driver requests
router.get('/driver-requests', authRequired, adminOnly, getPendingDriverRequests);

// Admin: approve driver
router.post('/approve-driver', authRequired, adminOnly, approveDriver);

// Admin: reject driver
router.post('/reject-driver', authRequired, adminOnly, rejectDriver);

module.exports = router;

