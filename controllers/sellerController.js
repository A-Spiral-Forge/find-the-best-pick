const handlerFactory = require('./handlerFactory');
const Seller = require('../models/sellerModel');
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
 * Update the current seller
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

	const seller = await Seller.findByPk(req.user.email);
	const updatedSeller = await seller.update(filteredBody);

	res.status(200).json({
		status: 'success',
		ok: true,
		data: {
			seller: updatedSeller,
		},
	});
});

/**
 * Get all Sellers from database
 */
exports.getAllSellers = handlerFactory.getAll(Seller, { exclude });

/**
 * Get one Seller from database
 */
exports.getOneSeller = handlerFactory.getOne(Seller, { exclude });

/**
 * Create Sellers in database
 */
exports.createSellers = handlerFactory.createEntries(Seller);

/**
 * Update Sellers in database
 */
exports.updateSeller = handlerFactory.updateOne(Seller);

/**
 * Delete Sellers from database
 */
exports.deleteSeller = handlerFactory.deleteOne(Seller);
