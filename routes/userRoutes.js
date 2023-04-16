const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const deliveryAddressController = require('../controllers/deliveryAddressController');

// Creating express router
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

// Below routers can be accessed only when user is logged in
router.use(authController.protect);

router.route('/logout').get(authController.logout);
router.route('/me').get(userController.getMe, userController.getOneUser);
router.route('/updatePassword').patch();
router.route('/updateMe').patch(userController.updateMe);
// router.route('/deleteMe').delete(userController.deleteMe);

// Routes for delivery address for users
router.route('/delivery-address/all', authController.restrictTo('admin'), deliveryAddressController.getAllDeliveryAddressOfUser);

router
	.route('/delivery-address')
	.get(deliveryAddressController.getAllDeliveryAddressOfUser)
    .post(deliveryAddressController.createDeliveryAddress);

router
	.route('/delivery-address/:id')
	.patch(deliveryAddressController.updateDeliveryAddressOfUser)
	.delete(deliveryAddressController.deleteDeliveryAddress);


// Below routers can be accessed by admin only
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
