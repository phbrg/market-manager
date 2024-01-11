const Product = require('../models/Product');

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
      .catch((err) => console.log(`> create product error: ${err}`));
  }
}