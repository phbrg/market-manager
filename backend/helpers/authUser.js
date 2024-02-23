require('dotenv').config();
const jwt = require('jsonwebtoken');

const getToken = require('./getToken');

const authUser = (req, res, next) => {
  const token = getToken(req);
  if(!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;

    next();
  } catch(err) {
    res.status(401).json({ message: 'Access denied.' });
    return;
  }
}

module.exports = authUser;