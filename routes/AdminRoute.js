const router = require('express').Router();

const AdminController = require('../controllers/AdminController');

const authAdmin = require('../helpers/authAdmin');

router.get('/users/:param1?/:param2?', authAdmin, AdminController.getUsers);

router.post('/register', authAdmin, AdminController.registerUser);

router.put('/edituser/:userId', authAdmin, AdminController.editUser);

router.delete('/deleteuser/:userId', authAdmin, AdminController.deleteUser);

module.exports = router;