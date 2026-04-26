const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/leaderboard
// @desc    Get top users in organization
router.get('/', protect, async (req, res) => {
  try {
    const leaderboard = await User.find({ orgId: req.user.orgId })
      .select('name points college badges role')
      .sort({ points: -1 })
      .limit(20);
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
