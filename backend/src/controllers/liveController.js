const LiveLocation = require('../models/LiveLocation');

// POST /api/live/update (driverOnly)
const updateLiveLocation = async (req, res) => {
  try {
    const { lat, lng, speed, heading } = req.body || {};

    // busId is derived from the authenticated driver's assigned bus
    const busId = req.user?.assignedBus;

    if (!busId) {
      return res.status(400).json({ message: 'Driver not assigned to bus' });
    }

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }

    const update = {
      lat,
      lng,
      speed: speed || 0,
      heading: heading || 0,
      lastUpdated: new Date(),
    };

    const location = await LiveLocation.findOneAndUpdate(
      { busId },
      update,
      { new: true, upsert: true }
    );

    console.log('Live location updated for bus:', busId.toString());
    return res.json(location);
  } catch (error) {
    console.error('updateLiveLocation error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/live/:busId
const getLiveLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const location = await LiveLocation.findOne({ busId });
    if (!location) {
      return res.status(404).json({ message: 'Live location not found' });
    }
    return res.json(location);
  } catch (error) {
    console.error('getLiveLocation error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateLiveLocation,
  getLiveLocation,
};

