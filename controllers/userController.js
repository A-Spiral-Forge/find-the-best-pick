const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const {filterObj} = require('../utils/helper');

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
 * Update the current user
 */
exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password modification. Please use /updatePassword for passoword updation.',
				400
			)
		);
	}

	const filteredBody = filterObj(
		req.body,
		'name',
		'contactNumber1',
		'contactNumber2'
	);
	const user = await User.findByPk(req.user.email);
	const updatedUser = await user.update(filteredBody);

	res.status(200).json({
		status: 'success',
		ok: true,
		data: {
			user: updatedUser,
		},
	});
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
