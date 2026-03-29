const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameHindi: { type: String },
  category: {
    type: String,
    enum: ['grain', 'vegetable', 'fruit', 'dairy', 'protein', 'spice', 'herb', 'oil', 'sweetener', 'beverage'],
    required: true
  },
  taste: [{ type: String, enum: ['sweet', 'sour', 'salty', 'pungent', 'bitter', 'astringent'] }],
  energy: { type: String, enum: ['heating', 'cooling', 'neutral'] },
  dosha: {
    vata: { type: String, enum: ['increases', 'decreases', 'neutral'] },
    pitta: { type: String, enum: ['increases', 'decreases', 'neutral'] },
    kapha: { type: String, enum: ['increases', 'decreases', 'neutral'] }
  },
  nutritionPer100g: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  season: [{ type: String, enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter'] }],
  benefits: [{ type: String }],
  contraindications: [{ type: String }],
  imageUrl: { type: String, default: '' }
});

module.exports = mongoose.model('Food', foodSchema);
