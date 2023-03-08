const express = require('express');
const userController = require('../controllers/userController');
const sellerController = require('../controllers/sellerController');
const authController = require('../controllers/authController');

// Creating express router
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

// Below routers can be accessed only when user is logged in
router.use(authController.protect);

router.route('/logout').get(authController.logout);
router.route('/me').get(userController.getMe, sellerController.getOneSeller);
router.route('/updateMe').patch(sellerController.updateMe);
router.route('/updatePassword').patch();

// Below routers can be accessed by admin only
router.use(authController.restrictTo('admin'));

router
	.route('/')
	.get(sellerController.getAllSellers)
	.post(sellerController.createSellers);

router
	.route('/:id')
	.get(sellerController.getOneSeller)
	.patch(sellerController.updateSeller)
	.delete(sellerController.deleteSeller);

module.exports = router;
