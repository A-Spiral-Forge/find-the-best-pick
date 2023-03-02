const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db.config');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/userModel');

const signToken = (id) =>
	jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
	});

const generateAndSendToken = (user, statusCode, res) => {
	const token = signToken(user.email);

	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	user.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		ok: true,
		token,
		data: {
			user: user,
		},
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const fields = Object.keys(User.rawAttributes);
	const entry = {};

	fields.forEach((el) => (entry[el] = req.body[el]));

	const user = await User.create(entry);

	generateAndSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email) return next(new AppError('Please provide email.', 400));

	if (!password) return next(new AppError('Please provide password.', 400));

	const user = await User.findByPk(email, {
		attributes: {
			exclude: [
				'createdAt',
				'updatedAt',
				'passwordChangedAt',
				'passwordResetToken',
				'passwordResetExpires',
			],
		},
	});

	if (!user)
		return next(new AppError('No user exists with this email.', 400));

	if (!bcrypt.compareSync(password, user.password))
		return next(new AppError('Incorrect password. Please try again.', 400));

	generateAndSendToken(user, 201, res);
});

exports.logout = catchAsync(async (req, res, next) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({ status: 'success', ok: true });
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token || token === 'null') {
		return next(
			new AppError(
				'You are not logged in. Please login to continue.',
				401
			)
		);
	}

	// console.log(token, process.env.JWT_SECRET_KEY);

	const decoded = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET_KEY
	);

	// console.log(decoded);

	const currentUser = await User.findByPk(decoded._id);

	if (!currentUser) {
		return next(
			new AppError('The user belonging to the token does not exist.', 401)
		);
	}

	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('Password changed recently. Please login again.', 401)
		);
	}

	req.user = currentUser;

	next();
});

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					'You have not permission to perform this action.',
					403
				)
			);
		}

		next();
	};
};
