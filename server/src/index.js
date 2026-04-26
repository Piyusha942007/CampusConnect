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
app.use(helmet());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/uploads', express.static(require('path').join(__dirname, '..', 'uploads')));

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

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
