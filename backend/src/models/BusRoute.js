const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
});

const busRouteSchema = new mongoose.Schema({
  name: String,
  from: String,
  to: String,
  stops: [stopSchema],
  polyline: [[Number]],
});

module.exports = mongoose.model('BusRoute', busRouteSchema);
