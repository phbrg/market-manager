const router = require('express').Router();

const UserController = require('../controllers/UserController');

const authUser = require('../helpers/authUser');

router.post('/registerproduct', authUser, UserController.registerProduct);

module.exports = router;