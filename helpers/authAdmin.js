require('dotenv').config();
const jwt = require('jsonwebtoken');
const getToken = require('./getToken');

const getUserByToken = require('./getUserByToken');

const authAdmin = async (req, res, next) => {
  if(!req.headers.authorization) {
    res.status(401).json({ error: 'Access denied.' });
    return;
  }

  const token = getToken(req);

  if(!token) {
    res.status(401).json({ error: 'Access denied.' });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;

    const user = await getUserByToken(token);

    if(user.role == 'BOSS' || user.role == 'MANAGER') {
      next();
    } else {
      res.status(401).json({ error: 'Access denied.' });
      return;
    }

  } catch(err) {
    res.status(400).json({ error: 'Invalid token.' });
    return;
  }
}

module.exports = authAdmin;