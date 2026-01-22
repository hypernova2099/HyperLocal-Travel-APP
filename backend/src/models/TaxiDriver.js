const mongoose = require('mongoose');

const taxiDriverSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicle: String,
  area: String,
  rating: Number,
  languages: [String],
});

module.exports = mongoose.model('TaxiDriver', taxiDriverSchema);
