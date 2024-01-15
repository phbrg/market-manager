require('dotenv').config();
const bcrypt = require('bcrypt');

const User = require('../models/User');

const createUserToken = require('../helpers/createUserToken');
const getToken = require('../helpers/getToken');
const getUserByToken = require('../helpers/getUserByToken');

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
        await createUserToken(user, req, res);
      })
      .catch((err) => { 
        console.log(`> register user error: ${err}`);
        res.status(500).json({ message: 'Internal server error, try again later.' });
      });
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

  static async editUser(req, res) {
    const { userId } = req.params;
    const { name, login, password, confirmPassword, role, adminPassword } = req.body;

    if(!userId) {
      res.status(404).json({ message: 'Invalid user id.' });
      return;
    }

    const userOnDatabase = await User.findOne({ raw: true, where: { id: parseFloat(userId) } }) || null;
    if(!userOnDatabase) {
      res.status(404).json({ message: 'Invalid user id.' });
      return;
    }

    const putUser = {
      name: userOnDatabase.name,
      login: userOnDatabase.login,
      password: userOnDatabase.password,
      role: userOnDatabase.role,
    };

    const stringRegex = /^[0-9a-zA-Z]+$/i;

    if(name && name.length !== 0) {
      if(!stringRegex.test(name)) {
        res.status(422).json({ message: 'User name cannot contain special characters.' });
        return;
      }

      putUser.name = name;
    }

    if(login && login.length !== 0) {
      if(!stringRegex.test(login)) {
        res.status(422).json({ message: 'User login cannot contain special characters.' });
        return;
      }

      const loginAlredyRegistered = await User.findOne({ raw: true, where: { login: login.toLowerCase() } }) || null;
      if(loginAlredyRegistered && loginAlredyRegistered.id !== parseFloat(userId)) {
        res.status(422).json({ message: 'Login is alredy been used by other user.' });
        return;
      }

      putUser.login = login;
    }

    if(password && password.length !== 0) {
      if(password.length < 8) {
        res.status(422).json({ message: 'Too short password.' });
        return;
      }

      if(password !== confirmPassword) {
        res.status(422).json({ message: 'Password does not match.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      putUser.password = hashedPassword;
    }

    if(role && role.length !== 0) {
      putUser.role == role.toUpperCase();
    }

    await User.update(putUser, { where: { id: parseFloat(userId) } })
      .then(() => {
        res.status(200).json({ message: 'User successfully updated.' });
      }).catch((err) => {
        console.log(`> update user error: ${err}`);
        res.status(500).json({ message: 'Internal server error, try again later.' });
      })
  }

  static async deleteUser(req, res) {
    const { userId } = req.params;
    const userToken = await getToken(req);
    const userByToken = await getUserByToken(userToken, req, res);

    if(!userId) {
      res.status(404).json({ message: 'Invalid user id.' });
      return;
    }

    if(parseFloat(userId) == parseFloat(userByToken.id)) {
      res.status(422).json({ message: 'You cannot delete your own account.' });
      return;
    }

    const userOnDatabase = await User.findOne({ raw: true, where: { id: parseFloat(userId) } }) || null;
    if(!userOnDatabase) {
      res.status(404).json({ message: 'Invalid user id.' });
      return;
    }

    await User.destroy({ where: { id: parseFloat(userId) } })
      .then(() => {
        res.status(200).json({ message: 'User successfully deleted.' });
      }).catch((err) => {
        console.log(`> user delete error: ${err}`);
        res.status(500).json({ message: 'Internal server error, try again later.' });
      });
  }
}