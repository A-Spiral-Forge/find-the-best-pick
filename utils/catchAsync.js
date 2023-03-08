/**
 * Catch error and send it to next middleware
 * @param {*} fn Function that takes (req, res, next) as arguments
 */
module.exports = (fn) => (req, res, next) => {
	fn(req, res, next).catch((err) => next(err));
};
