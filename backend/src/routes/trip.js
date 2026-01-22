const express = require('express');
const { planTrip } = require('../controllers/tripController');

const router = express.Router();

router.post('/plan', planTrip);

module.exports = router;
