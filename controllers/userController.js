const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// Exclude fields when querying database
const exclude = [
	'password',
	'passwordChangedAt',
	'passwordResetToken',
	'passwordResetExpires',
	'createdAt',
	'updatedAt', 
];

/**
 * Function to get the data of current user
 */
exports.getMe = catchAsync(async (req, res, next) => {
	// Set request params as current users email
	req.params.id = req.user.email;
	next();
});

/**
 * Get all users from database
 */
exports.getAllUsers = handlerFactory.getAll(User, { exclude });

/**
 * Get one user from database
 */
exports.getOneUser = handlerFactory.getOne(User, { exclude });

/**
 * Create users in database
 */
exports.createUsers = handlerFactory.createEntries(User);

/**
 * Update users in database
 */
exports.updateUser = handlerFactory.updateOne(User);

/**
 * Delete users from database
 */
exports.deleteUser = handlerFactory.deleteOne(User);
