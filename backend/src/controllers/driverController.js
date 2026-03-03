const DriverRequest = require('../models/DriverRequest');
const User = require('../models/User');
const Bus = require('../models/Bus');
const BusRoute = require('../models/BusRoute');

// POST /api/driver/apply (authRequired)
const applyForDriver = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { busNumber, operatorName, licenseNumber, routeId } = req.body || {};

    if (!busNumber || !operatorName || !licenseNumber || !routeId) {
      return res.status(400).json({
        message: 'busNumber, operatorName, licenseNumber, and routeId are required',
      });
    }

    // Validate that routeId exists
    const route = await BusRoute.findById(routeId);
    if (!route) {
      return res.status(400).json({ message: 'Invalid routeId' });
    }

    const request = await DriverRequest.create({
      userId,
      busNumber,
      operatorName,
      licenseNumber,
      routeId,
    });

    console.log('New driver request created:', request._id.toString());
    return res.status(201).json({
      message: 'Application submitted',
      requestId: request._id,
    });
  } catch (error) {
    console.error('applyForDriver error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/driver/assigned-bus (driverOnly)
const getAssignedBus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('assignedBus');
    if (!user || !user.assignedBus) {
      return res.status(404).json({ message: 'No bus assigned to driver' });
    }
    const bus = await Bus.findById(user.assignedBus);
    if (!bus) {
      return res.status(404).json({ message: 'Assigned bus not found' });
    }
    return res.json(bus);
  } catch (error) {
    console.error('getAssignedBus error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  applyForDriver,
  getAssignedBus,
};

