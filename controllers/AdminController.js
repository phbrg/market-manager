require('dotenv').config();
const bcrypt = require('bcrypt');

const User = require('../models/User');

const createUserToken = require('../helpers/createUserToken');

module.exports = class AdminController {
  static async registerUser(req, res) {
    const { name, login, password, confirmPassword, adminPassword } = req.body;

    if(adminPassword !== process.env.SYSTEM_PASSWORD ) {
      res.status(404).json({ message: 'Acess denied.' });
      return;
    }

    if(!name ||!login || !password || !confirmPassword || name.length == 0 || login.length == 0 || password.length == 0 || confirmPassword.length == 0) {
      res.status(422).json({ message: 'Invalid credentials.' });
      return;
    }

    const loginExist = await User.findOne({ raw: true, where: { login: login.toLowerCase() } }) || null;
    if(loginExist) {
      res.status(422).json({ error: 'Login alredy registered.' });
      return;
    }

    const stringRegex = /^[0-9a-zA-Z]+$/i;
    if(!stringRegex.test(login) || !stringRegex.test(name)) {
      res.status(422).json({ error: 'Invalid credentials.' });
      return;
    }

    if(password.length < 8) {
      res.status(422).json({ error: `Password too short.` });
      return;
    }

    if(password !== confirmPassword) {
      res.status(422).json({ error: `Passwords doesn't match.` });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      name: name.toLowerCase(),
      login: login.toLowerCase(),
      password: hashedPassword
    }

    await User.create(user)
      .then(async (user) => {
        await createUserToken(user, res);
      })
      .catch((err) => console.log(`> register user error: ${err}`));
  }

  static async getUsers(req, res) {
    let param1 = null;
    let param2 = null;

    if(req.params) {
      param1 = req.params.param1;
      param2 = req.params.param2 || null;
    }

    let response;
    let status;

    switch(param1) {
      case 'employee':
        response = await User.findAll({ raw: true, where: { role: 'EMPLOYEE' } }) || null;
        status = 200;
        break;
      case 'id': 
        if(!param2) {
          response = 'Invalid search.';
          status = 404;
        } else {
          response = await User.findAll({ raw: true, where: { id: parseFloat(param2) } }) || null;
          status = 200;
        }
        break;
      case 'name':
        if(!param2) {
          response = 'Invalid search.';
          status = 404;
        } else {
          response = await User.findAll({ raw: true, where: { name: param2.toLowerCase() } }) || null;
          status = 200;
        }
        break;
      case 'login':
        if(!param2) {
          response = 'Invalid search.';
          status = 404;
        } else {
          response = await User.findAll({ raw: true, where: { login: param2.toLowerCase() } }) || null;
          status = 200;
        }
        break;
      default:
        response = await User.findAll({ raw: true }) || null;
        status = 200;
    }

    if(response == [] || response.length == 0 || response == '' || response == null) {
      response = "Couldn't find your user.";
      status = 404;
    }

    res.status(status).json({ response });
  }
}