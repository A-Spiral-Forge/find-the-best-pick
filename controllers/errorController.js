const AppError = require('./../utils/appError');

const handleDuplicateFieldsDB = (error) => {
	const fieldValue = error.keyValue.name;
	const message = `Tour with name: '${fieldValue}' already exists, please choose another!`;

	return new AppError(message, 400);
};

const handleParsingError = (error) => {
	const message = `The query parameters given by you is invalid, please check and try again.`;

	return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
	const errors = Object.values(error.errors).map((el) => el.message);
	const message = `Input correct field values! ${errors.join('. ')}`;

	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid token. Please login again!', 401);

const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		res.status(err.statusCode).json({
			status: err.status,
			ok: false,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	} else {
		res.status(404).render('error', { title: 'Something Went Wrong' });
	}
};

const handleJWTExpiredError = () =>
	new AppError('Token expired. Please login again to continue!', 401);

const sendErrorProd = (err, req, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			ok: false,
			message: err.message,
		});
	} else {
		console.error(`Error 🤧🤧:`, err);

		res.status(500).json({
			status: 'error',
			ok: false,
			message: 'Something went very wrong!',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...JSON.parse(JSON.stringify(err)) };
		if (error.code === 'ER_DUP_ENTRY')
			error = handleDuplicateFieldsDB(error);
		if (error.code === 'ER_PARSE_ERROR') error = handleParsingError(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		sendErrorProd(error, req, res);
	}

	next();
};
