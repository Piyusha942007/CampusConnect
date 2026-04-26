const express = require('express');
const router = express.Router();
const { analyzeGitHubProfile } = require('../services/githubAnalyzer');
const { protect } = require('../middleware/auth');

// @route   GET /api/github/analyze
// @desc    Analyze GitHub profile
router.get('/analyze', protect, async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ message: 'Username is required' });

  try {
    const analysis = await analyzeGitHubProfile(username);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
