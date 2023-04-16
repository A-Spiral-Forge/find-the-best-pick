const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

// Create express router
const router = express.Router();

router
	.route('/')
	.get(productController.getAllProducts)
	.post(
		authController.protect,
		authController.restrictTo('seller'),
		productController.createOneProduct
	);

router
	.route('/:id')
	.get(productController.getOneProduct)
	.patch(
		authController.protect,
		authController.restrictTo('seller'),
		productController.updateOneProduct
	)
	.delete(
		authController.protect,
		authController.restrictTo('seller'),
		productController.deleteOneProduct
	);

module.exports = router;