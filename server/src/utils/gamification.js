const User = require('../models/User');

const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  const now = new Date();
  const lastActive = user.lastActiveDate || new Date(0);

  const diffInHours = Math.abs(now - lastActive) / 36e5;

  if (diffInHours < 24) {
    // Already active today, do nothing
    return;
  } else if (diffInHours < 48) {
    // Active within 24-48 hours, increment streak
    user.streak += 1;
  } else {
    // Break streak
    user.streak = 1;
  }

  user.lastActive = now;
  await user.save();
};

const checkBadges = async (userId) => {
  const user = await User.findById(userId);
  const badges = [...user.badges];
  let changed = false;

  // Badge: First Blood (First 100 points)
  if (user.points >= 100 && !badges.includes('First Blood')) {
    badges.push('First Blood');
    changed = true;
  }

  // Badge: Centurion (1000 points)
  if (user.points >= 1000 && !badges.includes('Centurion')) {
    badges.push('Centurion');
    changed = true;
  }

  // Badge: Streak Master (7 day streak)
  if (user.streak >= 7 && !badges.includes('Streak Master')) {
    badges.push('Streak Master');
    changed = true;
  }

  if (changed) {
    user.badges = badges;
    await user.save();
  }
};

module.exports = { updateStreak, checkBadges };
