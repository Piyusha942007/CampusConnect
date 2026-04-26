const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/org/me
// @desc    Get current user's organization
router.get('/me', protect, async (req, res) => {
  try {
    const org = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/org/:id/ambassadors
// @desc    Get all ambassadors for an organization
router.get('/:id/ambassadors', protect, authorize('admin'), async (req, res) => {
  try {
    const ambassadors = await User.find({ orgId: req.params.id, role: 'ambassador' }).select('-password');
    res.json(ambassadors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
