const router = require('express').Router();

const UserController = require('../controllers/UserController');

const authUser = require('../helpers/authUser');

router.post('/registerproduct', authUser, UserController.registerProduct);
router.post('/login', UserController.login);
router.post('/registersale', authUser, UserController.registerSale);

router.put('/editproduct/:product', authUser, UserController.editProduct);

router.delete('/deleteproduct/:product', authUser, UserController.deleteProduct);

router.get('/products/:param1?/:param2?', authUser, UserController.getProducts);

module.exports = router;