const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/ambassadors
// @desc    Get all ambassadors for the admin's organization
router.get('/ambassadors', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const ambassadors = await User.find({ 
      orgId: req.user.orgId, 
      role: 'ambassador' 
    }).select('-password').sort({ name: 1 });
    
    res.json(ambassadors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
