require('dotenv').config();
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const getUserByToken = async (token, req, res) => {
  if(!token) {
    res.status(401).json({ message: 'Access denied.' });
    return;
  }
  
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const userId = decoded.id; 

  const userOnDatabase = await User.findOne({ raw: true, where: { id: userId } });
  const user = {
    id: userOnDatabase.id,
    name: userOnDatabase.name,
    login: userOnDatabase.login,
    role: userOnDatabase.role,
    createdAt: userOnDatabase.createdAt,
    updatedAt: userOnDatabase.updatedAt,
  }

  return user;
}

module.exports = getUserByToken;