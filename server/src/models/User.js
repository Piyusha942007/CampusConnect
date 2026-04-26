const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'ambassador'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  college: {
    type: String
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  googleId: String,
  githubId: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  githubUsername: String,
  points: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: Date,
  badges: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
