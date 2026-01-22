const express = require('express');
const { getTaxis } = require('../controllers/taxiController');

const router = express.Router();

router.get('/', getTaxis);

module.exports = router;
