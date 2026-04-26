const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const { uploadFileToDrive } = require('../services/driveService');
const Submission = require('../models/Submission');
const Task = require('../models/Task');
const User = require('../models/User');
const Organization = require('../models/Organization');

// Use disk storage as a temp holding area before uploading to Drive
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// @route   POST /api/submissions
// @desc    Submit task proof
router.post('/', protect, upload.single('file'), async (req, res) => {
  const { taskId, textProof, linkProof } = req.body;
  const file = req.file;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if already submitted
    const existing = await Submission.findOne({ userId: req.user._id, taskId });
    if (existing) return res.status(400).json({ message: 'Task already submitted' });

    let fileUrl = null;
    let driveFileId = null;

    if (file) {
      try {
        // Upload to Google Drive shared folder
        const driveData = await uploadFileToDrive(file);
        fileUrl = driveData.webViewLink;
        driveFileId = driveData.id;
      } catch (driveErr) {
        console.error('Drive upload failed, saving locally:', driveErr.message);
        // Fallback: keep the local file
        fileUrl = `/uploads/${file.filename}`;
      }
    }

    const submission = await Submission.create({
      userId: req.user._id,
      taskId,
      orgId: req.user.orgId,
      status: 'pending',
      content: {
        text: textProof,
        link: linkProof,
        fileUrl,
        driveFileId
      }
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/submissions/my
router.get('/my', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id }).populate('taskId');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/submissions/org
router.get('/org', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const submissions = await Submission.find({ orgId: req.user.orgId })
      .populate('userId', 'name email college')
      .populate('taskId', 'title points');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { updateStreak, checkBadges } = require('../utils/gamification');

// @route   POST /api/submissions/:id/approve
router.post('/:id/approve', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    if (submission.status !== 'pending') return res.status(400).json({ message: 'Already processed' });

    submission.status = 'approved';
    await submission.save();

    // Award points to user
    const task = await Task.findById(submission.taskId);
    await User.findByIdAndUpdate(submission.userId, {
      $inc: { points: task.points }
    });

    // Update streaks and check for badges
    await updateStreak(submission.userId);
    await checkBadges(submission.userId);

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/submissions/:id/reject
router.post('/:id/reject', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    
    submission.status = 'rejected';
    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
