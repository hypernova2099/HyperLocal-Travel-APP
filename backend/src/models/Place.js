const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: String,
  type: String, // food | activity | attraction | emergency
  subtype: String,
  lat: Number,
  lng: Number,
  area: String,
  rating: Number,
  priceLevel: Number,
  isOpenNow: Boolean,
});

module.exports = mongoose.model('Place', placeSchema);
