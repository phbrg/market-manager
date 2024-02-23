require('dotenv').config();
const jwt = require('jsonwebtoken');

const createUserToken = async(user, req, res) => {
  const token = jwt.sign({
    id: user.id,
    name: user.name,
  }, process.env.JWT_KEY);
  
  res.status(200).json({ message: 'You are successfully authenticated.', token });
}

module.exports = createUserToken;