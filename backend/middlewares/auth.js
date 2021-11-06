const jwt = require('jsonwebtoken');
const LoginPasswordError = require('../errors/login-password-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.cookies.jwt;
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    return next();
  } catch (error) {
    throw new LoginPasswordError('Необходима авторизация');
  }
}
