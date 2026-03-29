const express = require('express');
const router = express.Router();
const HealthLog = require('../models/HealthLog');
const { protect } = require('../middleware/auth');

// @route GET /api/health-logs
router.get('/', protect, async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/health-logs
router.post('/', protect, async (req, res) => {
  try {
    const log = await HealthLog.create({ ...req.body, user: req.user._id });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/health-logs/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user._id }).sort({ date: -1 }).limit(7);
    if (!logs.length) return res.json({ message: 'No data yet' });
    
    const avg = (key) => logs.reduce((sum, l) => sum + (l[key] || 0), 0) / logs.length;
    
    res.json({
      avgEnergy: avg('energy').toFixed(1),
      avgDigestion: avg('digestion').toFixed(1),
      avgSleep: avg('sleep').toFixed(1),
      avgMood: avg('mood').toFixed(1),
      totalLogs: logs.length,
      trend: logs.map(l => ({ date: l.date, energy: l.energy, mood: l.mood }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
