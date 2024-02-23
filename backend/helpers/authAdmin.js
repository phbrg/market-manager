require('dotenv').config();
const jwt = require('jsonwebtoken');

const getUserByToken = require('./getUserByToken');
const getToken = require('./getToken');

const authAdmin = async (req, res, next) => {
  const token = getToken(req);
  if(!token) {
    res.status(401).json({ message: 'Access denied.' });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;

    const user = await getUserByToken(token);

    if(user.role == 'BOSS' || user.role == 'MANAGER') {
      next();
    } else {
      res.status(401).json({ message: 'Access denied.' });
      return;
    }

  } catch(err) {
    res.status(400).json({ message: 'Invalid token.' });
    return;
  }
}

module.exports = authAdmin;