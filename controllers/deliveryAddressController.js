const handlerFactory = require('./handlerFactory');
const DeliveryAddress = require('../models/deliveryAddressModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**
 * Get all delivery addresses from database
 */
exports.getAllDeliveryAddresses = handlerFactory.getAll(DeliveryAddress);

/**
 * Get all the delivery address of current user (only when user is logged in)
 */
exports.getAllDeliveryAddressOfUser = catchAsync(async (req, res, next) => {
	// Get user id from req user
	const { email } = req.user;

	// Get all delivery address assciated with the user id
	const deliveryAddresses = await DeliveryAddress.findAll({
		where: {
			customerEmail: email,
			active: true,
		},
		attributes: {
			exclude: ['active', 'id'],
		},
	});

	// Send all delivery address with response
	return res.status(200).json({
		status: 'success',
		ok: true,
		data: {
			deliveryAddresses,
		},
	});
});

/**
 * Create a new delivery address for logged in user
 */
exports.createDeliveryAddress = catchAsync(async (req, res, next) => {
	// Get user id from req user
	const { email } = req.user;

	// Set customer email in address object
	req.body.customerEmail = email;

	// Create new address
	const deliveryAddress = await DeliveryAddress.create(req.body, {
		ignoreDuplicates: true,
	});

	deliveryAddress.id = undefined;
	deliveryAddress.active = undefined;

	// Send the created address to array
	return res.status(201).json({
		status: 'success',
		ok: false,
		data: {
			deliveryAddress,
		},
	});
});

/**
 * Update the existing delivery address of user with address id
 */
exports.updateDeliveryAddressOfUser = catchAsync(async (req, res, next) => {
	// Get user id from req user
	const { email } = req.user;
	const addressId = req.params.id;

	// Find delivery address assciated with the user id
	const doc = await DeliveryAddress.findOne({
		where: {
			customerEmail: email,
			id: addressId,
			active: true,
		},
	});

	// Check if any address exists
	if (!doc) {
		return next(new AppError('No delivery address found with given data', 404));
	}

	// Update the address if exists
	const deliveryAddress = await doc.update(req.body);

	// Send updated address with response
	return res.status(200).json({
		status: 'success',
		ok: true,
		data: {
			deliveryAddress,
		},
	});
});

/**
 * Delete a delivery address
 */
exports.deleteDeliveryAddress = catchAsync(async (req, res, next) => {
	// Get user id from req user
	const { email } = req.user;
	const addressId = req.params.id;

	// Find delivery address assciated with the user id
	const doc = await DeliveryAddress.findOne({
		where: {
			customerEmail: email,
			id: addressId,
			active: true,
		},
	});

	// Check if any address exists
	if (!doc) {
		return next(new AppError('No delivery address found with given data', 404));
	}

	// Delete delivery address from database
	const deliveryAddressDeleted = await doc.update({ active: false });

	return res.status(204).json({
		status: 'success',
		ok: true,
		data: {
			deliveryAddressDeleted,
		},
	});
});
