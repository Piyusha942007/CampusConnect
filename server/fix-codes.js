require('dotenv').config();
const mongoose = require('mongoose');

async function fixOrgs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({ email: String, orgId: mongoose.Schema.Types.ObjectId, role: String }));
    const Organization = mongoose.model('Organization', new mongoose.Schema({ name: String, inviteCode: String }));

    // 1. Find Vinayak and his Org
    const vinayak = await User.findOne({ email: 'amrutkarvinayak3@gmail.com' });
    if (!vinayak) throw new Error('Vinayak not found');
    
    const vinayakOrg = await Organization.findById(vinayak.orgId);
    console.log(`Vinayak's current org: ${vinayakOrg.name} (${vinayakOrg.inviteCode})`);

    // 2. Find whoever currently has 'CAMPUS'
    const otherOrg = await Organization.findOne({ inviteCode: 'CAMPUS' });
    if (otherOrg && otherOrg._id.toString() !== vinayakOrg._id.toString()) {
      console.log(`Renaming old CAMPUS code on org: ${otherOrg.name}`);
      otherOrg.inviteCode = 'UNSAID';
      await otherOrg.save();
    }

    // 3. Set Vinayak's org code to CAMPUS
    vinayakOrg.inviteCode = 'CAMPUS';
    await vinayakOrg.save();
    console.log(`✅ Success: Vinayak's org (${vinayakOrg.name}) now uses code: CAMPUS`);

    // 4. Move Piyusha (ambassador) to this org
    const piyusha = await User.findOne({ email: 'piyushaamrutkar007@gmail.com' });
    if (piyusha) {
      piyusha.orgId = vinayakOrg._id;
      await piyusha.save();
      console.log(`✅ Success: Piyusha moved to Vinayak's organization.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixOrgs();
