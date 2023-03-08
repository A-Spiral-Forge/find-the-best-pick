const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');

/**
 * Get All documents from the database
 * @param {*} Model Modal for querying
 * @param {*} options Options for querying
 * @returns
 */
exports.getAll = (Model, options) =>
	catchAsync(async (req, res, next) => {
		// Write sorting query
		const sortingQuery = req.query.sort
			?.split(',')
			.forEach((query) => query.split('_'));

		// Fetch data from the dataset with given conditions
		const data = await Model.findAll({
			attributes: { exclude: options.exclude },
			order: sortingQuery ? sortingQuery : [Model.primaryKeyAttributes],
			limit: req.query.limit ? req.query.limit : 10,
		});

		// Return data in the response 
		return res.status(200).json({
			status: 'success',
			ok: true,
			length: data.length,
			data: data,
		});
	});

/**
 * Get One document by primary key
 * @param {*} Model Modal for querying
 * @param {*} options options for querying
 * @returns 
 */
exports.getOne = (Model, options) =>
	catchAsync(async (req, res, next) => {
		// Get primary key
		const pk = req.params.id;

		// Find by primary key
		const doc = await Model.findByPk(pk, {
			attributes: { exclude: options.exclude },
		});

		// Return the document in response
		return res.status(200).json({
			status: 'success',
			ok: true,
			data: doc,
		});
	});

/**
 * Creating the document in the modal
 * @param {*} Model Modal for querying 
 * @returns 
 */
exports.createEntries = (Model) =>
	catchAsync(async (req, res, next) => {
		// Check if the given data is Array or Object
		if (typeof req.body.data !== 'object') {
			return next(new AppError('Please provide valid data.', 400));
		}

		// If the given data is not an array, create one entry
		if (!Array.isArray(req.body.data)) {
			const fields = Object.keys(Model.rawAttributes);
			const entry = {};

			fields.forEach((el) => (entry[el] = req.body.data[el]));

			// Create the entry and return response
			const data = await Model.create(entry);

			return res.status(201).json({
				status: 'success',
				ok: true,
				data: data,
			});
		}

		// If the data is object, create bulk entries
		const fields = Object.keys(Model.rawAttributes);
		const entries = [];

		req.body.data.forEach((el) => {
			const entry = {};
			fields.forEach((field) => (entry[field] = el[field]));
			entries.push(entry);
		});

		// Create bulk entries and return the response
		const data = await Model.bulkCreate(entries);

		return res.status(201).json({
			status: 'success',
			ok: true,
			data: data,
		});
	});

/**
 * Update the document in modal using primary key
 * @param {*} Model Modal for querying
 * @returns 
 */
exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		// get primary key and updated fields from req
		const pk = req.params.id;

		const updatedValues = req.body;

		// Find document in database
		const doc = await Model.findByPk(pk);

		if (!doc) {
			return next(new AppError('No doc exists with this ID', 404));
		}

		// Uopdate document and send response
		const data = await doc.update(updatedValues);

		return res.status(200).json({
			status: 'success',
			ok: true,
			data: data,
		});
	});

/**
 * Delete the document in modal using primary key
 * @param {*} Model Modal for querying
 * @returns 
 */
exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		// Get id from req parameters
		const pk = req.params.id;

		// Find doc in database
		const doc = await Model.findByPk(pk);

		if (!doc) {
			return next(new AppError('No doc found with this Email', 404));
		}

		// Delete doc from database
		const data = await doc.destroy();

		return res.status(204).json({
			status: 'success',
			ok: true,
			data: data,
		});
	});
