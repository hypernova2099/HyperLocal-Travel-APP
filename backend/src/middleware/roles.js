// Role-based access control middleware built on top of authRequired
const User = require('../models/User');

// Only allow admins
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return next();
};

// Only allow drivers
const driverOnly = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Load the latest user from DB to ensure role & assigned bus are current
    const user = await User.findById(req.user.userId).select('role assignedBus');
    if (!user || user.role !== 'driver') {
      return res.status(403).json({ message: 'Driver access required' });
    }

    // Attach assignedBus to req.user for downstream controllers
    req.user.assignedBus = user.assignedBus || null;
    return next();
  } catch (error) {
    console.error('driverOnly middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminOnly,
  driverOnly,
};

