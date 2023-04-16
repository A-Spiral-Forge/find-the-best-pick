// Module Import
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/customerModel');

/**
 * 
 * @param {String} id ID of user 
 * @returns {String} JSON Web Token for the session
 */
const signToken = (id) =>
	jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
	});

/**
 * 
 * @param {*} user User 
 * @param {Number} statusCode Status code
 * @param {*} res Response obejct
 */
const generateAndSendToken = (user, statusCode, res) => {
	// Generate JWT for session
	const token = signToken(user.email);

	// Set cookie for session
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true, // Cannot changed from browser
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	// Remove password from response
	user.password = undefined;

	// Send response
	res.status(statusCode).json({
		status: 'success',
		ok: true,
		token,
		data: {
			user: user,
		},
	});
};

/**
 * Sign Up function for users signing to application.
 */
exports.signup = catchAsync(async (req, res, next) => {
	const fields = Object.keys(User.rawAttributes);
	const entry = {};

	// Filter req object by fields present in schema
	if(req.body.role) {
		req.body.role = req.body.role.toLowerCase();
		req.body.role = req.body.role === 'admin' ? 'customer' : req.body.role;
	}
	
	if(req.body.dateOfBirth) {
		try {
			req.body.dateOfBirth = new Date(req.body.dateOfBirth).toISOString();
		} catch(err) {
			console.log(err);
			return next(new AppError('Invalid date', 400));
		}
	}

	fields.forEach((el) => {
		entry[el] = req.body[el]
	});

	// Create user and send session token
	const user = await User.create(entry);
	generateAndSendToken(user, 201, res);
});

/**
 * Log In function for users to log in
 */
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

	// Send session token, if all validations passed
	generateAndSendToken(user, 201, res);
});

/**
 * Logging out user from application
 */
exports.logout = catchAsync(async (req, res, next) => {
	// Set cookie to any invalid string value to log out
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	// Send response with cookie
	res.status(200).json({ status: 'success', ok: true });
});

/**
 * Middleware to restrict the access of routes without login to the application
 * @returns Error if user is not valid or not logged in, else next middleware
 */
exports.protect = catchAsync(async (req, res, next) => {
	let token;

	// Get token from header or cookie
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

	// Decode JWT to extract ID from it
	const decoded = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET_KEY
	);

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

	// Set user to request, if user is valid
	req.user = currentUser;

	next();
});

/**
 * Middleware to restrict unauthorised users to access the routes
 * @param  {...String} roles List of roles who can access the route
 * @returns Error if user doesn't have permission, else move to next middleware
 */
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// Check if user role is present in allowed roles
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
