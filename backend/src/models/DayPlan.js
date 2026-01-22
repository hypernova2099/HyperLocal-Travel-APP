const mongoose = require('mongoose');

const dayPlanItemSchema = new mongoose.Schema({
  time: String,
  title: String,
  type: String, // food | activity | attraction
});

const dayPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: String, // "half" | "full"
  interests: [String],
  items: [dayPlanItemSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DayPlan', dayPlanSchema);
