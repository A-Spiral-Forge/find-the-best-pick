const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Products = require('../models/productModel');

exports.getAllProducts = handlerFactory.getAll(Products, {
    exclude: ['description', 'sepcifications', 'video', 'images', 'minimumOrderCount'],
});
exports.getOneProduct = handlerFactory.getOne(Products);
exports.updateOneProduct = handlerFactory.updateOne(Products);
exports.deleteOneProduct = handlerFactory.deleteOne(Products);

exports.createOneProduct = catchAsync((req, res, next) => {
    req.body.sellerEmail = req.user.email;
    handlerFactory.createEntries(Products);
});