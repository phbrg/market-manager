require('dotenv').config();
const jwt = require('jsonwebtoken');

const createUserToken = async(user, req, res) => {
  const token = jwt.sign({
    id: user.id,
    name: user.name,
  }, process.env.JWT_KEY);

  res.cookie('token', token, {
    httpOnly: false,
    secure: false,
    sameSite: 'none',
    maxAge: 604800000, // 1 week
    path: '/'
  });
  
  res.status(200).json({ message: 'You are successfully authenticated.' });
}

module.exports = createUserToken;