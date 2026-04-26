const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const User = require('./src/models/User');
  const Task = require('./src/models/Task');
  const Organization = require('./src/models/Organization');

  // List all organizations
  const orgs = await Organization.find();
  console.log(`=== ORGANIZATIONS (${orgs.length}) ===`);
  orgs.forEach(o => console.log(`  - ${o.name} | Code: ${o.inviteCode} | ID: ${o._id}`));

  // List all users
  const users = await User.find().select('name email role orgId isVerified');
  console.log(`\n=== USERS (${users.length}) ===`);
  users.forEach(u => console.log(`  - ${u.name} | ${u.email} | Role: ${u.role} | OrgId: ${u.orgId || 'NONE'} | Verified: ${u.isVerified}`));

  // List all tasks
  const tasks = await Task.find();
  console.log(`\n=== TASKS (${tasks.length}) ===`);
  tasks.forEach(t => console.log(`  - ${t.title} | OrgId: ${t.orgId} | Status: ${t.status} | Points: ${t.points}`));

  if (tasks.length === 0) {
    console.log('\n⚠️  NO TASKS FOUND! The admin needs to create tasks first.');
  }

  const ambassadors = users.filter(u => u.role === 'ambassador');
  const noOrg = ambassadors.filter(u => !u.orgId);
  if (noOrg.length > 0) {
    console.log('\n⚠️  These ambassadors have NO orgId (they cannot see tasks):');
    noOrg.forEach(u => console.log(`  - ${u.name} (${u.email})`));
  }

  await mongoose.disconnect();
}

checkDB().catch(console.error);
