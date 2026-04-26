require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ambassadors = [
  { name: 'Ravi Kumar', email: 'ravi@example.com', college: 'IIT Bombay', points: 450 },
  { name: 'Shreya Sharma', email: 'shreya@example.com', college: 'BITS Pilani', points: 380 },
  { name: 'Aryan Singh', email: 'aryan@example.com', college: 'DTU Delhi', points: 290 },
  { name: 'Isha Gupta', email: 'isha@example.com', college: 'NSUT Delhi', points: 520 },
  { name: 'Rahul Verma', email: 'rahul@example.com', college: 'VIT Vellore', points: 150 },
  { name: 'Ananya Das', email: 'ananya@example.com', college: 'SRM University', points: 610 },
  { name: 'Vikram Malhotra', email: 'vikram@example.com', college: 'Manipal IT', points: 340 }
];

async function seedAmbassadors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({ 
      name: String, 
      email: { type: String, unique: true }, 
      password: String,
      role: String,
      orgId: mongoose.Schema.Types.ObjectId,
      college: String,
      points: { type: Number, default: 0 },
      isVerified: { type: Boolean, default: true }
    }));

    // Find Vinayak's org
    const vinayak = await User.findOne({ email: 'amrutkarvinayak3@gmail.com' });
    if (!vinayak) throw new Error('Vinayak not found');
    const orgId = vinayak.orgId;

    console.log(`Seeding 7 ambassadors for Org ID: ${orgId}`);

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const amb of ambassadors) {
      await User.findOneAndUpdate(
        { email: amb.email },
        { 
          ...amb, 
          password: hashedPassword, 
          role: 'ambassador', 
          orgId,
          isVerified: true 
        },
        { upsert: true, new: true }
      );
    }

    console.log('✅ Successfully added 7 realistic ambassadors!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedAmbassadors();
