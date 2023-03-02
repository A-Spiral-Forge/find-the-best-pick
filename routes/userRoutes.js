const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.use(authController.protect);

router.route('/logout').get(authController.logout);
router.route('/me').get(userController.getMe, userController.getOneUser);
router.route('/updatePassword').patch();

router.use(authController.restrictTo('admin'));

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUsers);

router
	.route('/:id')
	.get(userController.getOneUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
