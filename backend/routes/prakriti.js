const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Prakriti questions
const prakritiQuestions = [
  {
    id: 1,
    category: "Body Frame",
    question: "What is your natural body frame?",
    options: [
      {
        text: "Thin, light, difficult to gain weight",
        dosha: "vata",
        score: 2,
      },
      { text: "Medium, muscular, athletic build", dosha: "pitta", score: 2 },
      {
        text: "Large, heavy, tendency to gain weight",
        dosha: "kapha",
        score: 2,
      },
    ],
  },
  {
    id: 2,
    category: "Skin",
    question: "How would you describe your skin?",
    options: [
      { text: "Dry, rough, thin, cold to touch", dosha: "vata", score: 2 },
      { text: "Oily, warm, prone to acne/rashes", dosha: "pitta", score: 2 },
      { text: "Thick, moist, oily, cool to touch", dosha: "kapha", score: 2 },
    ],
  },
  {
    id: 3,
    category: "Hair",
    question: "What is your natural hair type?",
    options: [
      { text: "Dry, brittle, frizzy, tends to break", dosha: "vata", score: 2 },
      {
        text: "Fine, oily, early greying or thinning",
        dosha: "pitta",
        score: 2,
      },
      {
        text: "Thick, wavy, lustrous, tends to be oily",
        dosha: "kapha",
        score: 2,
      },
    ],
  },
  {
    id: 4,
    category: "Appetite",
    question: "How is your appetite generally?",
    options: [
      {
        text: "Irregular, sometimes strong sometimes absent",
        dosha: "vata",
        score: 2,
      },
      {
        text: "Strong, intense, irritable when hungry",
        dosha: "pitta",
        score: 2,
      },
      {
        text: "Slow but steady, can skip meals easily",
        dosha: "kapha",
        score: 2,
      },
    ],
  },
  {
    id: 5,
    category: "Digestion",
    question: "How is your digestion?",
    options: [
      { text: "Irregular, prone to gas and bloating", dosha: "vata", score: 2 },
      {
        text: "Sharp, efficient, prone to heartburn/acidity",
        dosha: "pitta",
        score: 2,
      },
      { text: "Slow, heavy feeling after eating", dosha: "kapha", score: 2 },
    ],
  },
  {
    id: 6,
    category: "Sleep",
    question: "How do you sleep?",
    options: [
      {
        text: "Light sleeper, easily disturbed, insomnia",
        dosha: "vata",
        score: 2,
      },
      {
        text: "Moderate sleep, fall asleep easily but wake up",
        dosha: "pitta",
        score: 2,
      },
      { text: "Deep, heavy sleep, love sleeping", dosha: "kapha", score: 2 },
    ],
  },
  {
    id: 7,
    category: "Mind & Emotions",
    question: "What is your mental/emotional tendency?",
    options: [
      {
        text: "Anxious, worried, changeable, creative",
        dosha: "vata",
        score: 2,
      },
      {
        text: "Intense, focused, competitive, irritable",
        dosha: "pitta",
        score: 2,
      },
      {
        text: "Calm, stable, slow to anger, sentimental",
        dosha: "kapha",
        score: 2,
      },
    ],
  },
  {
    id: 8,
    category: "Memory",
    question: "How is your memory?",
    options: [
      { text: "Quick to learn but quick to forget", dosha: "vata", score: 2 },
      { text: "Sharp, precise, good recall", dosha: "pitta", score: 2 },
      {
        text: "Slow to learn but excellent long-term memory",
        dosha: "kapha",
        score: 2,
      },
    ],
  },
  {
    id: 9,
    category: "Weather Preference",
    question: "What weather do you prefer?",
    options: [
      { text: "Warm and moist weather", dosha: "vata", score: 2 },
      { text: "Cool, well-ventilated environments", dosha: "pitta", score: 2 },
      { text: "Warm and dry weather", dosha: "kapha", score: 2 },
    ],
  },
  {
    id: 10,
    category: "Activity Level",
    question: "What is your natural activity level?",
    options: [
      { text: "Hyperactive, always moving, restless", dosha: "vata", score: 2 },
      {
        text: "Moderate, goal-oriented, purposeful movement",
        dosha: "pitta",
        score: 2,
      },
      { text: "Slow, steady, prefer relaxation", dosha: "kapha", score: 2 },
    ],
  },
];

// @route GET /api/prakriti/questions
router.get("/questions", (req, res) => {
  res.json(prakritiQuestions);
});

// @route POST /api/prakriti/assess
router.post("/assess", protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, dosha, score }

    const scores = { vata: 0, pitta: 0, kapha: 0 };
    answers.forEach((answer) => {
      scores[answer.dosha] += answer.score;
    });

    // Determine primary prakriti
    const total = scores.vata + scores.pitta + scores.kapha;
    const percentages = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100),
    };

    let prakriti = "";
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const [first, second] = sorted;
    prakriti = first[0];

    // Save to user
    await User.findByIdAndUpdate(req.user._id, {
      prakriti,
      prakritiScore: scores,
    });

    res.json({ prakriti, scores: percentages, rawScores: scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
