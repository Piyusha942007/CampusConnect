const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const generateInviteCode = require('../utils/generateInviteCode');
const { protect } = require('../middleware/auth');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const { sendOTP } = require('../services/emailService');

// @route   POST /api/auth/request-otp
// @desc    Send OTP for verification
router.post('/request-otp', async (req, res) => {
  const { email, role } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save/Update user with OTP (don't create full user yet, or use a temp model)
    // For simplicity, we'll use the User model with isVerified: false
    let user = await User.findOne({ email });
    if (user && user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    if (!user) {
      user = new User({ email, name: 'Temporary', role: role || 'ambassador', isVerified: false });
    }
    
    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendOTP(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete registration
router.post('/verify-otp', async (req, res) => {
  const { email, otp, name, password, role, orgName, inviteCode, college } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    let orgId = null;
    if (role === 'admin') {
      const newInviteCode = generateInviteCode();
      const org = await Organization.create({ name: orgName, inviteCode: newInviteCode });
      orgId = org._id;
    } else {
      const org = await Organization.findOne({ inviteCode });
      if (!org) return res.status(400).json({ message: 'Invalid invite code' });
      orgId = org._id;
    }

    user.name = name;
    user.password = password;
    user.role = role;
    user.orgId = orgId;
    user.college = college;
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    if (role === 'admin') {
      await Organization.findByIdAndUpdate(orgId, { adminId: user._id });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      orgId: user.orgId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const passport = require('passport');

// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /api/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&role=${req.user.role}`);
});

// @route   GET /api/auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @route   GET /api/auth/github/callback
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&role=${req.user.role}`);
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        orgId: user.orgId
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/auth/complete-profile
// @desc    Link ambassador to organization via invite code
router.put('/complete-profile', protect, async (req, res) => {
  const { inviteCode, college } = req.body;
  try {
    const org = await Organization.findOne({ inviteCode });
    if (!org) return res.status(400).json({ message: 'Invalid invite code' });

    const user = await User.findById(req.user._id);
    user.orgId = org._id;
    user.college = college;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: req.token,
      orgId: user.orgId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
