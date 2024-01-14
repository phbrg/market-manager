const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const Product = require('../models/Product');
const User = require('../models/User');

const createUserToken = require('../helpers/createUserToken');

module.exports = class UserController {
  static async registerProduct(req, res) {
    const { name, price, amount, expiration } = req.body;

    if(!name || !price || !amount || !expiration || name.length == 0 || price.length == 0 || amount.length == 0 || expiration.length == 0) {
      res.status(422).json({ message: 'Invalid credentials.' });
      return;
    }

    const stringRegex = /^[0-9a-zA-Z ]+$/i;
    if(!stringRegex.test(name)) {
      res.status(422).json({ message: 'Invalid product name.' });
      return;
    }

    const expirationDate = new Date(expiration);
    if(expirationDate < new Date()) {
      res.status(422).json({ message: 'Invalid product expiration date.' });
      return;
    }

    const productAlredyRegisterd = await Product.findOne({ raw: true, where: { name: name } }) || null;
    if(productAlredyRegisterd) {
      res.status(422).json({ message: 'Product alredy registered.' });
      return;
    }

    const product = {
      name,
      price,
      amount,
      expiration
    }

    await Product.create(product)
      .then((product) => {
        res.status(200).json({ message: 'Product successfully created.', product });
      })
      .catch((err) => { 
        console.log(`> create product error: ${err}`) 
        res.status(500).json({ message: 'Internal server error, try again later.' });
      });
  }

  static async getProducts(req, res) {
    let param1 = null;
    let param2 = null;

    if(req.params) {
      param1 = req.params.param1;
      param2 = req.params.param2 || null;
    }

    let response = [];
    let status;

    switch(param1) {
      case 'in-stock':
        response = await Product.findAll({ raw: true, where: { amount: { [Op.gt]: 0 } } }) || null;
        status = 200;
        break;
      case 'out-of-stock':
        response = await Product.findAll({ raw: true, where: { amount: 0 } }) || null;
        status = 200;
        break;
      case 'id': 
        if(!param2) {
          response = 'Invalid search.';
          status = 404;
        } else {
          response = await Product.findAll({ raw: true, where: { id: parseFloat(param2) } }) || null;
          status = 200;
        }
        break;
      case 'name': 
        if(!param2) {
          response = 'Invalid search.';
          status = 404;
        } else {
          response = await Product.findAll({ raw: true, where: { name: param2 } }) || null;
          status = 200;
        }
        break;
      case 'expired': 
        const productsExpired = await Product.findAll({ raw: true });
        productsExpired.map((product) => {
          if(new Date(product.expiration) < new Date()) {
            response.push(product);
          }
        });
        status = 200;
        break;
      case 'unexpired': 
        const productsUnexpired = await Product.findAll({ raw: true }) || null;
        productsUnexpired.map((product) => {
          if(new Date(product.expiration) > new Date()) {
            response.push(product);
          }
        });
        status = 200;
        break;
      default:
        response = await Product.findAll({ raw: true }) || null;
        status = 200;
    }

    if(response == [] || response.length == 0 || response == '' || response == null) {
      response = "Couldn't find your product.";
      status = 404;
    }

    res.status(status).json({ response });
  }

  static async editProduct(req, res) {
    const { product } = req.params;
    const { name, price, amount, expiration } = req.body;

    if(!product || product == '') {
      res.status(404).json({ message: 'Invalid product.' });
      return;
    }

    const productOnDatabase = await Product.findOne({ raw: true, where: { id: parseFloat(product) } }) || null;

    if(!productOnDatabase || productOnDatabase == '' || productOnDatabase.length == 0) {
      res.status(404).json({ message: 'Invalid product id.' });
      return;
    }

    const putProduct = {
      name,
      price,
      amount,
      expiration
    }

    if(!name || name == '' || name.length == 0) {
      putProduct.name = productOnDatabase.name;
    } else {
      const stringRegex = /^[0-9a-zA-Z ]+$/i;
      if(!stringRegex.test(name)) {
        res.status(422).json({ message: 'Invalid product name.' });
        return;
      }
    }

    if(!price || price == '' || price.length == 0) {
      putProduct.price = productOnDatabase.price;
    }

    if(!amount || amount == '' || amount.length == 0) {
      putProduct.amount = productOnDatabase.amount;
    }

    if(!expiration || expiration == '' || expiration.length == 0) {
      putProduct.expiration = productOnDatabase.expiration;
    } else {
      const expirationDate = new Date(expiration);
      if(expirationDate < new Date()) {
        res.status(422).json({ message: 'Invalid product expiration date.' });
        return;
      }
    }

    await Product.update(putProduct, { where: { id: parseFloat(product) } })
      .then(() => {
        res.status(200).json({ message: 'Product successfully updated.' });
      }).catch((err) => { 
        console.log(`> product update error: ${err}`);
        res.status(500).json({ message: 'Internal server error, try again later.' });
      });
  }

  static async deleteProduct(req, res) {
    const { product } = req.params;

    if(!product || product == '') {
      res.status(404).json({ message: 'Invalid product.' });
      return;
    }

    const productOnDatabase = await Product.findOne({ raw: true, where: { id: parseFloat(product) } }) || null;

    if(!productOnDatabase || productOnDatabase == '' || productOnDatabase.length == 0) {
      res.status(404).json({ message: 'Invalid product id.' });
      return;
    }

    await Product.destroy({ where: { id: parseFloat(product) } })
      .then(() => {
        res.status(200).json({ message: 'Product sucessfully deleted.' });
      }).catch((err) => { 
        console.log(`> product delete error: ${err}`); 
        res.status(500).json({ message: 'Internal server error, try again later.' });
      });
  }

  static async login(req, res) {
    const { login, password } = req.body;

    if(!login || !password) {
      res.status(422).json({ message: 'Invalid credentials.' });
      return;
    }

    const userOnDatabase = await User.findOne({ raw: true, where: { login: login.toLowerCase() } }) || null;
    if(!userOnDatabase) {
      res.status(422).json({ message: 'Invalid login.' });
      return;
    }

    const comparePassword = bcrypt.compareSync(password, userOnDatabase.password);
    if(!comparePassword) {
      res.status(422).json({ message: 'Invalid password.' });
      return;
    }

    createUserToken(userOnDatabase, req, res);
  }
}