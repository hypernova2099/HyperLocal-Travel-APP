const TaxiDriver = require('../models/TaxiDriver');

// GET /api/taxis
const getTaxis = async (req, res) => {
  try {
    const taxis = await TaxiDriver.find({});
    return res.json(taxis);
  } catch (error) {
    console.error('getTaxis error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTaxis,
};
