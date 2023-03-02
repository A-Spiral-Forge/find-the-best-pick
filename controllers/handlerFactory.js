const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');

exports.getAll = (Model, options) =>
	catchAsync(async (req, res, next) => {
		console.log(req.query);
		const sortingQuery = req.query.sort
			?.split(',')
			.forEach((query) => query.split('_'));

		const data = await Model.findAll({
			attributes: { exclude: options.exclude },
			order: sortingQuery ? sortingQuery : [Model.primaryKeyAttributes],
			limit: req.query.limit ? req.query.limit : 10,
		});

		res.status(200).json({
			status: 'success',
			ok: true,
			length: data.length,
			data: data,
		});
	});

exports.getOne = (Model, options) =>
	catchAsync(async (req, res, next) => {
		const pk = req.params.id;

		const doc = await Model.findByPk(pk, {
			attributes: { exclude: options.exclude },
		});

		res.status(200).json({
			status: 'success',
			ok: true,
			data: doc,
		});
	});

exports.createEntries = (Model) =>
	catchAsync(async (req, res, next) => {
		if (typeof req.body.data !== 'object') {
			return next(new AppError('Please provide valid data.', 400));
		}

		if (!Array.isArray(req.body.data)) {
			const fields = Object.keys(Model.rawAttributes);
			const entry = {};

			fields.forEach((el) => (entry[el] = req.body.data[el]));

			const data = await Model.create(entry);

			res.status(201).json({
				status: 'success',
				ok: true,
				data: data,
			});
		} else {
			const fields = Object.keys(Model.rawAttributes);
			const entries = [];

			req.body.data.forEach((el) => {
				const entry = {};
				fields.forEach((field) => (entry[field] = el[field]));
				entries.push(entry);
			});

			const data = await Model.bulkCreate(entries);

			res.status(201).json({
				status: 'success',
				ok: true,
				data: data,
			});
		}
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const pk = req.params.id;

		const updatedValues = req.body;

		const doc = await Model.findByPk(pk);

		if (!doc) {
			return next(new AppError('No doc exists with this ID', 404));
		}

		const data = await doc.update(updatedValues);

		res.status(200).json({
			status: 'success',
			ok: true,
			data: data,
		});
	});

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const pk = req.params.id;

		const doc = await Model.findByPk(pk);

		if (!doc) {
			return next(new AppError('No doc found with this Email', 404));
		}

		const data = await doc.destroy();

		res.status(204).json({
			status: 'success',
			ok: true,
			data: data,
		});
	});
