const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: Number,
  energy: { type: Number, min: 1, max: 10 },
  digestion: { type: Number, min: 1, max: 10 },
  sleep: { type: Number, min: 1, max: 10 },
  mood: { type: Number, min: 1, max: 10 },
  meals: [{ mealName: String, foods: [String], time: String }],
  water: Number, // glasses
  symptoms: [String],
  notes: String
});

module.exports = mongoose.model('HealthLog', healthLogSchema);
