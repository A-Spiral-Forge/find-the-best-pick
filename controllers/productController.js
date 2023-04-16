const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Products = require('../models/productModel');
const ProductSpecifications = require('../models/productSpecificationModel');
const { Sequelize } = require('sequelize');

exports.getAllProducts = handlerFactory.getAll(Products, {
	exclude: [
		'description',
		'sepcifications',
		'video',
		'images',
		'minimumOrderCount',
        'createdAt',
        'updatedAt',
        'sellerEmail',
	],
});
exports.getOneProduct = handlerFactory.getOne(Products, {
    exclude: [
        'sellerEmail'
    ],
    include: [
        {
            model: ProductSpecifications,
            as: 'specifications',
            attributes: ['title', 'value'],
        }
    ],
});
exports.updateOneProduct = handlerFactory.updateOne(Products);
exports.deleteOneProduct = handlerFactory.deleteOne(Products);

exports.createOneProduct = catchAsync(async (req, res, next) => {
	if (!req.body.specifications) {
		return next(new AppError('Please specify the product specifications.'));
	}

	if (!Array.isArray(req.body.specifications)) {
		return next(
			new AppError(
				'Product specifications must be an array of objects with title and value.'
			)
		);
	}

	req.body.sellerEmail = req.user.email;

    const fields = Object.keys(Products.rawAttributes);
    const entry = {};

    fields.forEach((el) => (entry[el] = req.body[el]));

    // Create product entry
    const product = await Products.create(entry);
    const productId = product.getDataValue('id');
    const productSpecifications = [];

    req.body.specifications.forEach(async (el) => {
        const obj = {
            title: el.title,
            value: el.value,
            productId: productId,
        };
        productSpecifications.push(obj);
        await ProductSpecifications.create(obj);
    });

    return res.status(201).json({
        status: 'success',
        ok: true,
        data: {
            product,
            productSpecifications,
        },
    });
});
