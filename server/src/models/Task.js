const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['referral', 'social_post', 'event', 'content'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 10
  },
  deadline: {
    type: Date,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.Mixed, // 'all' or Array of user IDs
    default: 'all'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'active'
  },
  proofRequired: {
    type: Boolean,
    default: true
  },
  autoScore: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
