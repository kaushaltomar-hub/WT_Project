const express = require('express');
const router = express.Router();
const DietPlan = require('../models/DietPlan');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Ayurvedic diet recommendations database
const dietRecommendations = {
  vata: {
    principles: ['Eat warm, cooked, oily foods', 'Favor sweet, sour, salty tastes', 'Eat at regular intervals', 'Avoid raw, cold, dry foods'],
    meals: {
      earlyMorning: {
        name: 'Dawn Ritual',
        time: '6:00 - 7:00 AM',
        foods: [
          { foodName: 'Warm water with ghee', quantity: '1 glass', notes: 'Drink on empty stomach' },
          { foodName: 'Soaked almonds', quantity: '5-6 pieces', notes: 'Peeled overnight soaked' }
        ],
        benefits: 'Activates digestion, lubricates tissues'
      },
      breakfast: {
        name: 'Nourishing Breakfast',
        time: '7:30 - 8:30 AM',
        foods: [
          { foodName: 'Oats porridge with milk', quantity: '1 bowl', notes: 'Cooked with cardamom' },
          { foodName: 'Banana or mango', quantity: '1 medium', notes: 'Ripe, sweet fruits' },
          { foodName: 'Warm milk with ashwagandha', quantity: '1 cup', notes: 'Add honey when cooled' }
        ],
        benefits: 'Grounds vata, provides sustained energy'
      },
      midMorning: {
        name: 'Mid-Morning Snack',
        time: '10:30 - 11:00 AM',
        foods: [
          { foodName: 'Dates and cashews', quantity: '3-4 dates, 10 cashews', notes: 'Energy boosting combination' }
        ],
        benefits: 'Prevents energy dip, nourishes nervous system'
      },
      lunch: {
        name: 'Main Meal',
        time: '12:00 - 1:00 PM',
        foods: [
          { foodName: 'Basmati rice', quantity: '1 cup cooked', notes: 'With ghee' },
          { foodName: 'Moong dal with cumin', quantity: '1 bowl', notes: 'Well cooked, slightly oily' },
          { foodName: 'Root vegetables (carrot, sweet potato)', quantity: '1 cup', notes: 'Steamed or sauteed' },
          { foodName: 'Chapati with ghee', quantity: '2 pieces', notes: 'Whole wheat, warm' },
          { foodName: 'Buttermilk with rock salt', quantity: '1 glass', notes: 'Digestive aid' }
        ],
        benefits: 'Main nourishing meal of the day'
      },
      eveningSnack: {
        name: 'Evening Snack',
        time: '4:00 - 5:00 PM',
        foods: [
          { foodName: 'Warm milk with turmeric', quantity: '1 cup', notes: 'Golden milk' },
          { foodName: 'Sesame ladoo', quantity: '1-2 pieces', notes: 'Homemade' }
        ],
        benefits: 'Prevents late evening hunger, calming'
      },
      dinner: {
        name: 'Light Dinner',
        time: '7:00 - 8:00 PM',
        foods: [
          { foodName: 'Khichdi (rice and moong dal)', quantity: '1 bowl', notes: 'Easy to digest, add ghee' },
          { foodName: 'Cooked vegetables', quantity: '1 cup', notes: 'Well spiced with warming spices' },
          { foodName: 'Warm soup', quantity: '1 bowl', notes: 'Vegetable or bone broth' }
        ],
        benefits: 'Easy digestion, promotes restful sleep'
      }
    },
    herbs: [
      { name: 'Ashwagandha', usage: '500mg powder in warm milk', timing: 'Before bed' },
      { name: 'Triphala', usage: '1 tsp in warm water', timing: 'Bedtime' },
      { name: 'Ginger', usage: 'Fresh ginger tea', timing: 'Before meals' }
    ],
    avoid: ['Raw vegetables', 'Cold drinks', 'Carbonated beverages', 'Beans (causing gas)', 'Dry snacks', 'Caffeine excess']
  },
  
  pitta: {
    principles: ['Favor cooling, refreshing foods', 'Sweet, bitter, astringent tastes', 'Avoid spicy, oily, fried foods', 'Eat in calm environment'],
    meals: {
      earlyMorning: {
        name: 'Cooling Dawn',
        time: '6:00 - 7:00 AM',
        foods: [
          { foodName: 'Cool water with rose water', quantity: '1 glass', notes: 'Cools internal fire' },
          { foodName: 'Coconut water', quantity: '1 glass', notes: 'Alkalizing and cooling' }
        ],
        benefits: 'Cools pitta fire, hydrates'
      },
      breakfast: {
        name: 'Cooling Breakfast',
        time: '7:30 - 8:30 AM',
        foods: [
          { foodName: 'Sweet lassi', quantity: '1 glass', notes: 'With cardamom and rose' },
          { foodName: 'Fruits (pomegranate, sweet grapes, melons)', quantity: '1 bowl', notes: 'Sweet, ripe fruits' },
          { foodName: 'Oats with coconut milk', quantity: '1 bowl', notes: 'Cooling alternative to regular milk' }
        ],
        benefits: 'Balances pitta, provides cooling energy'
      },
      midMorning: {
        name: 'Mid-Morning Snack',
        time: '10:30 - 11:00 AM',
        foods: [
          { foodName: 'Cucumber slices with mint chutney', quantity: '1 cup', notes: 'Cooling snack' }
        ],
        benefits: 'Prevents pitta aggravation'
      },
      lunch: {
        name: 'Balanced Meal',
        time: '12:00 - 1:00 PM',
        foods: [
          { foodName: 'Basmati rice', quantity: '1 cup cooked', notes: 'Light and easy to digest' },
          { foodName: 'Cooling lentils (masoor dal)', quantity: '1 bowl', notes: 'Mildly spiced' },
          { foodName: 'Leafy greens (spinach, kale)', quantity: '1 cup', notes: 'Lightly sauteed with coriander' },
          { foodName: 'Mint raita', quantity: '1 bowl', notes: 'Digestive and cooling' },
          { foodName: 'Whole wheat chapati', quantity: '2 pieces', notes: 'Without too much ghee' }
        ],
        benefits: 'Satisfies strong pitta appetite without aggravating'
      },
      eveningSnack: {
        name: 'Evening Coolant',
        time: '4:00 - 5:00 PM',
        foods: [
          { foodName: 'Fennel tea', quantity: '1 cup', notes: 'Cooling digestive' },
          { foodName: 'Sweet fruits or dates', quantity: '2-3 pieces', notes: 'Low glycemic sweet' }
        ],
        benefits: 'Cools and refreshes'
      },
      dinner: {
        name: 'Light Evening Meal',
        time: '7:00 - 8:00 PM',
        foods: [
          { foodName: 'Cooling vegetable soup', quantity: '1 bowl', notes: 'Zucchini, asparagus, leafy greens' },
          { foodName: 'Quinoa or light rice', quantity: '1 cup', notes: 'Easy to digest grain' },
          { foodName: 'Coconut-based curry', quantity: '1 bowl', notes: 'Mild spices only' }
        ],
        benefits: 'Light, easy digestion, cool sleep'
      }
    },
    herbs: [
      { name: 'Brahmi (Bacopa)', usage: '300mg or tea', timing: 'Morning' },
      { name: 'Shatavari', usage: '500mg in cool milk', timing: 'Afternoon' },
      { name: 'Neem', usage: 'Neem tea or supplement', timing: 'Morning on empty stomach' }
    ],
    avoid: ['Spicy foods', 'Fermented foods', 'Red meat', 'Alcohol', 'Excess salt', 'Citrus (sour)', 'Fried foods']
  },
  
  kapha: {
    principles: ['Favor light, dry, warm foods', 'Pungent, bitter, astringent tastes', 'Avoid heavy, oily, sweet foods', 'Eat the largest meal at lunch'],
    meals: {
      earlyMorning: {
        name: 'Stimulating Dawn',
        time: '5:30 - 6:30 AM',
        foods: [
          { foodName: 'Warm lemon water with honey', quantity: '1 glass', notes: 'Kickstarts metabolism' },
          { foodName: 'Ginger tea', quantity: '1 cup', notes: 'Stimulating and warming' }
        ],
        benefits: 'Stimulates sluggish kapha metabolism'
      },
      breakfast: {
        name: 'Light Breakfast',
        time: '8:00 - 9:00 AM',
        foods: [
          { foodName: 'Light poha with veggies', quantity: '1 bowl', notes: 'Light beaten rice, lightly spiced' },
          { foodName: 'Herbal tea', quantity: '1 cup', notes: 'Ginger, tulsi, black pepper' }
        ],
        benefits: 'Light meal that does not aggravate kapha heaviness'
      },
      midMorning: {
        name: 'Optional Snack',
        time: '11:00 AM (if hungry)',
        foods: [
          { foodName: 'Sunflower or pumpkin seeds', quantity: '2 tbsp', notes: 'Light protein' }
        ],
        benefits: 'Light snack if needed'
      },
      lunch: {
        name: 'Main Meal',
        time: '12:00 - 1:00 PM',
        foods: [
          { foodName: 'Millet or barley', quantity: '1 cup cooked', notes: 'Lighter grains than rice' },
          { foodName: 'Spiced lentils (toor dal)', quantity: '1 bowl', notes: 'With mustard seeds, turmeric' },
          { foodName: 'Bitter/pungent vegetables (bitter gourd, radish)', quantity: '1 cup', notes: 'Stir-fried lightly' },
          { foodName: 'Thin chapati', quantity: '1-2 pieces', notes: 'Minimal oil/ghee' }
        ],
        benefits: 'Largest meal, stimulates digestion at its peak'
      },
      eveningSnack: {
        name: 'Light Snack',
        time: '4:00 - 5:00 PM',
        foods: [
          { foodName: 'Roasted chickpeas', quantity: '1 handful', notes: 'Spiced with pepper and cumin' }
        ],
        benefits: 'Light protein, prevents evening lethargy'
      },
      dinner: {
        name: 'Very Light Dinner',
        time: '6:00 - 7:00 PM',
        foods: [
          { foodName: 'Vegetable soup', quantity: '1 bowl', notes: 'Light broth-based, spiced' },
          { foodName: 'Salad with spiced dressing', quantity: '1 bowl', notes: 'Lemon, pepper, cumin dressing' }
        ],
        benefits: 'Very light dinner allows kapha to rest and reset'
      }
    },
    herbs: [
      { name: 'Trikatu (Ginger, Pepper, Pippali)', usage: 'Mixed powder 500mg', timing: 'Before meals' },
      { name: 'Guggul', usage: '500mg supplement', timing: 'Morning' },
      { name: 'Tulsi', usage: 'Tulsi tea', timing: 'Morning and evening' }
    ],
    avoid: ['Dairy excess', 'Sweets', 'Heavy oils', 'Cold foods', 'Fried foods', 'Meat excess', 'Bread/wheat excess']
  }
};

// @route GET /api/diet/plan
router.get('/plan', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.prakriti) {
      return res.status(400).json({ message: 'Please complete prakriti assessment first' });
    }
    
    // Get base prakriti (first part if dual)
    const basePrakriti = user.prakriti.split('-')[0];
    const recommendation = dietRecommendations[basePrakriti];
    
    if (!recommendation) {
      return res.status(404).json({ message: 'Diet plan not found for this prakriti' });
    }

    res.json({
      prakriti: user.prakriti,
      principles: recommendation.principles,
      meals: recommendation.meals,
      herbs: recommendation.herbs,
      avoid: recommendation.avoid
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/diet/recommendations/:prakriti
router.get('/recommendations/:prakriti', (req, res) => {
  const prakriti = req.params.prakriti.toLowerCase().split('-')[0];
  const recommendation = dietRecommendations[prakriti];
  if (!recommendation) {
    return res.status(404).json({ message: 'Prakriti not found' });
  }
  res.json(recommendation);
});

// @route GET /api/diet/seasonal
router.get('/seasonal', protect, async (req, res) => {
  const month = new Date().getMonth();
  let season;
  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 6) season = 'summer';
  else if (month >= 7 && month <= 8) season = 'monsoon';
  else if (month >= 9 && month <= 10) season = 'autumn';
  else season = 'winter';

  const seasonalTips = {
    spring: {
      focus: 'Detox and renewal',
      foods: ['Light grains', 'Bitter vegetables', 'Honey', 'Barley', 'Ginger'],
      avoid: ['Heavy dairy', 'Oily foods', 'Sweets'],
      lifestyle: ['Wake early', 'Exercise vigorously', 'Dry massage (Garshana)']
    },
    summer: {
      focus: 'Cooling and hydration',
      foods: ['Sweet fruits', 'Coconut water', 'Mint', 'Cucumber', 'Fennel'],
      avoid: ['Spicy foods', 'Alcohol', 'Red meat', 'Excess salt'],
      lifestyle: ['Avoid intense exercise in heat', 'Stay hydrated', 'Moon gazing meditation']
    },
    monsoon: {
      focus: 'Digestive strength',
      foods: ['Ginger', 'Rock salt', 'Warm soups', 'Old grains', 'Ghee'],
      avoid: ['Raw foods', 'Leafy greens', 'River fish', 'Excessive liquids'],
      lifestyle: ['Eat at regular times', 'Stay dry', 'Panchakarma period']
    },
    autumn: {
      focus: 'Balance and preparation',
      foods: ['Sweet and bitter foods', 'Ghee', 'Milk', 'Pomegranate', 'Grapes'],
      avoid: ['Excess cold foods', 'Irregular eating'],
      lifestyle: ['Moderate exercise', 'Oil massage', 'Meditate']
    },
    winter: {
      focus: 'Nourishment and warmth',
      foods: ['Warm, heavy foods', 'Sesame', 'Urad dal', 'Ghee', 'Jaggery', 'Root vegetables'],
      avoid: ['Cold drinks', 'Raw foods', 'Light dry foods'],
      lifestyle: ['Vigorous exercise', 'Oil massage daily', 'Warm clothing']
    }
  };

  res.json({ season, ...seasonalTips[season] });
});

module.exports = router;
