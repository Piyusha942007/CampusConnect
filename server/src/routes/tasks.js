const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/tasks
// @desc    Get all tasks for the user's organization
router.get('/', protect, async (req, res) => {
  try {
    const query = { orgId: req.user.orgId };
    if (req.user.role === 'ambassador') {
      query.status = 'active';
    }
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a task (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, description, type, points, deadline, assignedTo, proofRequired, autoScore } = req.body;
    const task = await Task.create({
      orgId: req.user.orgId,
      title,
      description,
      type,
      points,
      deadline,
      assignedTo: assignedTo || 'all',
      proofRequired,
      autoScore,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks/:id/submit
// @desc    Submit proof (Ambassador only)
router.post('/:id/submit', protect, authorize('ambassador'), async (req, res) => {
  try {
    const { proofType, driveFileLink, externalLink } = req.body;
    const submission = await Submission.create({
      taskId: req.params.id,
      ambassadorId: req.user._id,
      orgId: req.user.orgId,
      proofType,
      driveFileLink,
      externalLink
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/submissions/pending
// @desc    Get pending submissions for admin review
router.get('/submissions/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const submissions = await Submission.find({ orgId: req.user.orgId, status: 'pending' })
      .populate('taskId')
      .populate('ambassadorId', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
