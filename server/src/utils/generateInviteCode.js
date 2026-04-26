const crypto = require('crypto');

const generateInviteCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 character hex
};

module.exports = generateInviteCode;
