const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');

const Product = require('../models/Product');
const User = require('../models/User');
const Sale = require('../models/Sale');

const createUserToken = require('../helpers/createUserToken');
const getToken = require('../helpers/getToken');
const getUserByToken = require('../helpers/getUserByToken');
const createLog = require('../helpers/createLog');

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

    const userToken = await getToken(req);
    const user = await getUserByToken(userToken, req, res);

    await Product.create(product)
      .then(async (product) => {
        try {
          await createLog('CREATE', `New product registered in the database. [Name: ${product.name}, Price: ${product.price}, Amount: ${product.amount}, Expiration: ${product.expiration}]`, user.id);
        } catch(err) {
          console.log(`> create log error: ${err}`);
        }
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
        for(const product of productsExpired) {
          if(new Date(product.expiration) < new Date()) {
            response.push(product);
          }
        }
        status = 200;
        break;
      case 'unexpired': 
        const productsUnexpired = await Product.findAll({ raw: true }) || null;
        for(const product of productsExpired) {
          if(new Date(product.expiration) > new Date()) {
            response.push(product);
          }
        }
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

    const userToken = await getToken(req);
    const user = await getUserByToken(userToken, req, res);

    await Product.update(putProduct, { where: { id: parseFloat(product) } })
      .then(async () => {
        try {
          await createLog('UPDATE', `Product [${product}] has been updated.`, user.id);
        } catch(err) {
          console.log(`> create log error: ${err}`);
        }
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

    const userToken = await getToken(req);
    const user = await getUserByToken(userToken, req, res);

    await Product.destroy({ where: { id: parseFloat(product) } })
      .then(async () => {
        try {
          await createLog('DELETE', `Product [${product}] has been deleted.`, user.id);
        } catch(err) {
          console.log(`> create log error: ${err}`);
        }
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

    try {
      await createLog('ACESS', `User [${userOnDatabase.id}] login on [IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}, Device: ${req.headers['user-agent']}].`);
    } catch(err) {
      console.log(`> create log error: ${err}`);
    }

    createUserToken(userOnDatabase, req, res);
  }

  static async registerSale(req, res) {
    const { products } = req.body;

    if(!products || products.length == 0) {
      res.status(422).json({ message: 'Invalid products.' });
      return;
    }

    const userToken = await getToken(req);
    const user = await getUserByToken(userToken, req, res);

    try {
      for (const product of products) {
        const productOnDatabase = await Product.findOne({ raw: true, where: { id: parseFloat(product.id) } }) || null;
        if(!productOnDatabase) {
          throw new Error('Invalid product id.');
        }

        if(productOnDatabase.amount == 0 || product.amount > productOnDatabase.amount) {
          throw new Error('Invalid product amount.');
        }
        
        const newAmount = productOnDatabase.amount - product.amount;

        try {
          await Product.update({ amount: newAmount }, { where: { id: product.id }});
        } catch(err) {
          console.log(`> update product error: ${err}`);
          res.status(500).json({ message: 'Internal server error, try again later.' });
          return;
        }
      }
    } catch(err) {
      console.log(err);
      res.status(422).json({ error: err.message });
      return;
    } 

    await Sale.create({ products, UserId: parseFloat(user.id) })
      .then(async (sale) => {
        try {
          await createLog('CREATE', `New sale registered in database.`, user.id);
        } catch(err) {
          console.log(`> create log error: ${err}`);
        }
        res.status(200).json({ message: 'Sale successfully registered.', sale });
      }).catch((err) => {
        console.log(`> create sale error: ${err}`);
        res.status(500).json({ message: 'Internal server error, try again later.' });
      })
  }
}