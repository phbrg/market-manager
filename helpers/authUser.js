require('dotenv').config();
const jwt = require('jsonwebtoken');
const getToken = require('./getToken');

const authUser = (req, res, next) => {
  if(!req.headers.authorization) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  const token = getToken(req);

  if(!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;

    next();
  } catch(err) {
    res.status(400).json({ error: 'Invalid token.' });
    return;
  }
}

module.exports = authUser;