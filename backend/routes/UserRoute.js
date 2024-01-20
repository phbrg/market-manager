const router = require('express').Router();

const UserController = require('../controllers/UserController');

const authUser = require('../helpers/authUser');

router.post('/login', UserController.login);

router.post('/registersale', authUser, UserController.registerSale);

router.post('/registerproduct', authUser, UserController.registerProduct);
router.get('/products/:param1?/:param2?', authUser, UserController.getProducts);
router.put('/editproduct/:product', authUser, UserController.editProduct);
router.delete('/deleteproduct/:product', authUser, UserController.deleteProduct);

module.exports = router;