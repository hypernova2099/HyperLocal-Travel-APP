const Place = require('../models/Place');

// GET /api/emergency
const getEmergencyPoints = async (req, res) => {
  try {
    const emergencyPlaces = await Place.find({ type: 'emergency' });
    return res.json(emergencyPlaces);
  } catch (err) {
    console.error('getEmergencyPoints error:', err);
    return res.status(500).json({ message: 'Error fetching emergency points' });
  }
};

module.exports = {
  getEmergencyPoints,
};

