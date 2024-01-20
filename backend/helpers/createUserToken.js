require('dotenv').config();
const jwt = require('jsonwebtoken');

const createUserToken = async(user, req, res) => {
  const token = jwt.sign({
    id: user.id,
    name: user.name,
  }, process.env.JWT_KEY);

  // remove token ( send to cookies )
  res.status(200).json({ message: 'User successfully authenticated.', token: token});
}

module.exports = createUserToken;