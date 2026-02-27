const DriverRequest = require('../models/DriverRequest');

// POST /api/driver/apply (authRequired)
const applyForDriver = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { busNumber, operatorName, licenseNumber, routeId } = req.body || {};

    if (!busNumber || !operatorName || !licenseNumber || !routeId) {
      return res.status(400).json({ message: 'busNumber, operatorName, licenseNumber, and routeId are required' });
    }

    const request = await DriverRequest.create({
      userId,
      busNumber,
      operatorName,
      licenseNumber,
      routeId,
    });

    console.log('New driver request created:', request._id.toString());
    return res.status(201).json(request);
  } catch (error) {
    console.error('applyForDriver error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  applyForDriver,
};

