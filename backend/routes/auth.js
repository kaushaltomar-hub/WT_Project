const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });

// @route POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // If using bcrypt, add password check here

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
