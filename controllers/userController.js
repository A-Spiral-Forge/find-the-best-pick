const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const exclude = [
	'password',
	'passwordChangedAt',
	'passwordResetToken',
	'passwordResetExpires',
	'createdAt',
	'updatedAt', 
];

exports.getMe = catchAsync(async (req, res, next) => {
	req.params.id = req.user.email;
	next();
});

exports.getAllUsers = handlerFactory.getAll(User, { exclude });
exports.getOneUser = handlerFactory.getOne(User, { exclude });
exports.createUsers = handlerFactory.createEntries(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
