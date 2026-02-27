const DriverRequest = require('../models/DriverRequest');
const User = require('../models/User');
const Bus = require('../models/Bus');

// GET /api/admin/driver-requests (admin only)
const getPendingDriverRequests = async (req, res) => {
  try {
    const requests = await DriverRequest.find({ status: 'pending' }).populate('userId', 'name email role');
    return res.json(requests);
  } catch (error) {
    console.error('getPendingDriverRequests error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/approve-driver (admin only)
const approveDriver = async (req, res) => {
  try {
    const { requestId } = req.body || {};
    if (!requestId) {
      return res.status(400).json({ message: 'requestId is required' });
    }

    const request = await DriverRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Driver request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Assign a bus from the requested route to this driver
    const bus = await Bus.findOne({ routeId: request.routeId });
    if (!bus) {
      return res.status(400).json({ message: 'No bus found for route' });
    }

    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found for request' });
    }

    user.role = 'driver';
    user.assignedBus = bus._id;
    await user.save();

    request.status = 'approved';
    await request.save();

    console.log('Driver approved:', requestId.toString());
    return res.json({
      message: 'Driver approved',
      request,
      assignedBus: bus._id,
    });
  } catch (error) {
    console.error('approveDriver error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/reject-driver (admin only)
const rejectDriver = async (req, res) => {
  try {
    const { requestId } = req.body || {};
    if (!requestId) {
      return res.status(400).json({ message: 'requestId is required' });
    }

    const request = await DriverRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Driver request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    request.status = 'rejected';
    await request.save();

    console.log('Driver rejected:', requestId.toString());
    return res.json({ message: 'Driver rejected', request });
  } catch (error) {
    console.error('rejectDriver error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPendingDriverRequests,
  approveDriver,
  rejectDriver,
};

