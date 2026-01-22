const DayPlan = require('../models/DayPlan');
const Place = require('../models/Place');

// Map interests to place types
const interestToType = (interest) => {
  const value = (interest || '').toLowerCase();
  if (value === 'food') return 'food';
  if (value === 'backwaters' || value === 'beach' || value === 'shopping') return 'activity';
  return 'attraction';
};

// Build a simple timeline
const buildTimeline = (places = []) => {
  const startHour = 9;
  return places.slice(0, 6).map((place, idx) => {
    const hour = startHour + Math.floor(idx * 1.5);
    const time = `${hour}:00`;
    return {
      time,
      title: place.name,
      type: place.type === 'food' ? 'food' : place.type === 'activity' ? 'activity' : 'attraction',
    };
  });
};

// POST /api/dayplan (authRequired)
const createDayPlan = async (req, res) => {
  try {
    const { duration, interests = [] } = req.body || {};
    if (!duration) {
      return res.status(400).json({ message: 'duration is required' });
    }
    const types = interests.length ? interests.map(interestToType) : ['attraction', 'food', 'activity'];
    const places = await Place.find({ type: { $in: types } }).limit(12);
    const items = buildTimeline(places);

    const plan = await DayPlan.create({
      userId: req.user.userId,
      duration,
      interests,
      items,
    });

    return res.status(201).json(plan);
  } catch (error) {
    console.error('createDayPlan error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dayplan/my (authRequired)
const getMyPlans = async (req, res) => {
  try {
    const plans = await DayPlan.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    return res.json(plans);
  } catch (error) {
    console.error('getMyPlans error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDayPlan,
  getMyPlans,
};
