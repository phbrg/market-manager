const Product = require('../models/Product');

module.exports = class UserController {
  static async registerProduct(req, res) {
    const { name, price, amount, expiration } = req.body;

    if(!name || !price || !amount || !expiration || name.length == 0 || price.length == 0 || amount.length == 0 || expiration.length == 0) {
      res.status(422).json({ message: 'Invalid credentials.' });
      return;
    }
  }
}