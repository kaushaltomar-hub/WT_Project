const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  time: String,
  name: String,
  foods: [{ foodName: String, quantity: String, notes: String }],
  benefits: String
});

const dietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prakriti: { type: String, required: true },
  season: { type: String },
  healthGoal: { type: String },
  meals: {
    earlyMorning: mealSchema,
    breakfast: mealSchema,
    midMorning: mealSchema,
    lunch: mealSchema,
    eveningSnack: mealSchema,
    dinner: mealSchema
  },
  herbs: [{ name: String, usage: String, timing: String }],
  lifestyle: [{ type: String }],
  avoid: [{ type: String }],
  totalCalories: Number,
  isActive: { type: Boolean, default: true },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
