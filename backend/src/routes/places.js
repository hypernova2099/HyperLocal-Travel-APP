const express = require('express');
const { getPlaces, getPlacesAlongRoute } = require('../controllers/placesController');

const router = express.Router();

router.get('/', getPlaces);
router.get('/along-route', getPlacesAlongRoute);

module.exports = router;
