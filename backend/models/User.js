const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  weight: { type: Number }, // in kg
  height: { type: Number }, // in cm
  prakriti: {
    type: String,
    enum: ['vata', 'pitta', 'kapha', 'vata-pitta', 'pitta-kapha', 'vata-kapha', 'tridosha'],
    default: undefined
  },
  prakritiScore: {
    vata: { type: Number, default: 0 },
    pitta: { type: Number, default: 0 },
    kapha: { type: Number, default: 0 }
  },
  healthGoals: [{ type: String }],
  allergies: [{ type: String }],
  currentHealthIssues: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
