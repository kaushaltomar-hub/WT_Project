const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const { protect } = require('../middleware/auth');

// Seed data - common Ayurvedic foods
const ayurvedicFoods = [
  { name: 'Ghee', category: 'oil', taste: ['sweet'], energy: 'heating', dosha: { vata: 'decreases', pitta: 'decreases', kapha: 'increases' }, benefits: ['Improves digestion', 'Nourishes tissues', 'Enhances immunity'] },
  { name: 'Turmeric', category: 'spice', taste: ['bitter', 'pungent'], energy: 'heating', dosha: { vata: 'decreases', pitta: 'neutral', kapha: 'decreases' }, benefits: ['Anti-inflammatory', 'Blood purifier', 'Immune booster'] },
  { name: 'Ashwagandha', category: 'herb', taste: ['bitter', 'astringent'], energy: 'heating', dosha: { vata: 'decreases', pitta: 'neutral', kapha: 'decreases' }, benefits: ['Reduces stress', 'Improves strength', 'Promotes sleep'] },
  { name: 'Ginger', category: 'spice', taste: ['pungent'], energy: 'heating', dosha: { vata: 'decreases', pitta: 'increases', kapha: 'decreases' }, benefits: ['Stimulates digestion', 'Anti-nausea', 'Warming'] },
  { name: 'Basmati Rice', category: 'grain', taste: ['sweet'], energy: 'cooling', dosha: { vata: 'decreases', pitta: 'decreases', kapha: 'neutral' }, benefits: ['Easy to digest', 'Sattvic food', 'Balancing'] },
  { name: 'Moong Dal', category: 'protein', taste: ['sweet', 'astringent'], energy: 'cooling', dosha: { vata: 'neutral', pitta: 'decreases', kapha: 'decreases' }, benefits: ['Tridoshic', 'Easy protein', 'Detoxifying'] },
  { name: 'Coconut', category: 'fruit', taste: ['sweet'], energy: 'cooling', dosha: { vata: 'decreases', pitta: 'decreases', kapha: 'increases' }, benefits: ['Cooling', 'Nourishing', 'Hydrating'] },
  { name: 'Honey', category: 'sweetener', taste: ['sweet', 'astringent'], energy: 'heating', dosha: { vata: 'decreases', pitta: 'neutral', kapha: 'decreases' }, benefits: ['Anti-bacterial', 'Digestive aid', 'Energy source'] },
  { name: 'Triphala', category: 'herb', taste: ['all six tastes'], energy: 'neutral', dosha: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' }, benefits: ['Tridoshic rasayana', 'Digestive cleanser', 'Eye health'] },
  { name: 'Tulsi (Holy Basil)', category: 'herb', taste: ['pungent', 'bitter'], energy: 'heating', dosha: { vata: 'decreases', pitta: 'neutral', kapha: 'decreases' }, benefits: ['Adaptogen', 'Immune support', 'Respiratory health'] }
];

// @route GET /api/foods
router.get('/', async (req, res) => {
  try {
    let foods = await Food.find({});
    if (foods.length === 0) {
      // Return static data if DB empty
      foods = ayurvedicFoods;
    }
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/foods/dosha/:dosha
router.get('/dosha/:dosha', async (req, res) => {
  const dosha = req.params.dosha.toLowerCase();
  const filtered = ayurvedicFoods.filter(f => f.dosha[dosha] === 'decreases');
  res.json(filtered);
});

// @route POST /api/foods/seed (admin)
router.post('/seed', async (req, res) => {
  try {
    await Food.deleteMany({});
    const foods = await Food.insertMany(ayurvedicFoods);
    res.json({ message: `Seeded ${foods.length} foods` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
