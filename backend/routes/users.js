const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, age, gender, weight, height, healthGoals, allergies, currentHealthIssues } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, age, gender, weight, height, healthGoals, allergies, currentHealthIssues },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
