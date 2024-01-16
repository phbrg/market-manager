const router = require('express').Router();

const AdminController = require('../controllers/AdminController');

const authAdmin = require('../helpers/authAdmin');
const authUser = require('../helpers/authUser');

router.post('/register', authAdmin, AdminController.registerUser);
router.get('/users/:param1?/:param2?', authAdmin, AdminController.getUsers);
router.put('/edituser/:userId', authAdmin, AdminController.editUser);
router.delete('/deleteuser/:userId', authAdmin, AdminController.deleteUser);

router.get('/logs/:param1?/:param2?', authUser, AdminController.getLogs);

module.exports = router;