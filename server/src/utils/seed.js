const mongoose = require('mongoose');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect';
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB at ${uri.substring(0, 20)}...`);

    // Clear existing
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Task.deleteMany({});

    // Create Org
    const org = await Organization.create({
      name: 'UnsaidTalks',
      inviteCode: 'CAMPUS',
      adminId: null
    });

    // Create Admin
    const admin = await User.create({
      name: 'Admin Demo',
      email: 'demo@campusconnect.app',
      password: 'Demo@1234',
      role: 'admin',
      orgId: org._id
    });

    org.adminId = admin._id;
    await org.save();

    // Create Ambassadors
    await User.create({
      name: 'Ambassador Demo',
      email: 'ambassador@campusconnect.app',
      password: 'Demo@1234',
      role: 'ambassador',
      orgId: org._id,
      college: 'IIT Delhi',
      points: 450,
      streak: 5,
      badges: ['First Blood', 'On Fire']
    });

    // Create Tasks
    await Task.create({
      orgId: org._id,
      title: 'LinkedIn Outreach',
      description: 'Share our hackathon post on your LinkedIn profile and tag 3 friends.',
      type: 'social_post',
      points: 100,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
      status: 'active'
    });

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
