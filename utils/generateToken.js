const jwt = require('jsonwebtoken');
const SECRET_KEY = 'super-secret-key';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
};

module.exports = generateToken;
