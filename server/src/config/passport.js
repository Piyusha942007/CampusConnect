const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        const userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        
        if (!userEmail) {
          return done(new Error('Google account must have an email address'), null);
        }

        user = await User.findOne({ email: userEmail });
        if (user) {
          user.googleId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: userEmail,
            role: 'ambassador',
            isVerified: true
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        const userEmail = (profile.emails && profile.emails.length > 0) 
          ? profile.emails[0].value 
          : (profile.username ? `${profile.username}@github.com` : null);

        if (!userEmail) {
          return done(new Error('GitHub account must have an email or username'), null);
        }

        user = await User.findOne({ email: userEmail });
        if (user) {
          user.githubId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: userEmail,
            githubUsername: profile.username,
            role: 'ambassador',
            isVerified: true
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
