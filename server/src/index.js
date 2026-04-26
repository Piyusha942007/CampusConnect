require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/uploads', express.static(require('path').join(__dirname, '..', 'uploads')));

// Database Connection Optimization for Serverless (Vercel)
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("CRITICAL ERROR: MONGODB_URI is missing from environment variables!");
}

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const conn = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Fail early if IP is blocked or URI is wrong
  });
  
  cachedDb = conn;
  console.log('Connected to MongoDB');
  return conn;
}

// On Vercel, ensure DB is connected before processing ANY route
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/org', require('./routes/org'));
app.use('/api/github', require('./routes/github'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Default route
app.get('/', (req, res) => {
  res.send('CampusConnect API is running...');
});

// Only start the local server if we are NOT on Vercel
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;

