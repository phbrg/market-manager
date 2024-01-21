require('dotenv').config();
const jwt = require('jsonwebtoken');

const createUserToken = async(user, req, res) => {
  const token = jwt.sign({
    id: user.id,
    name: user.name,
  }, process.env.JWT_KEY);

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
  });
  
  res.status(200).json({ message: 'User successfully authenticated.' });
}

module.exports = createUserToken;