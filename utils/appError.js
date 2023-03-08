/**
 * Creating errors inside application
 */
class AppError extends Error {
	/**
	 * 
	 * @param {String} message Error message
	 * @param {Number} statusCode Error code
	 */
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.ok = false;
		this.isOperational = true;

		Error.captureStackTrace(this, this.message);
	}
}

module.exports = AppError;
