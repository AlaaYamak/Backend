const APIError = require('./api-error');

class NotFoundRoutesHandler {
	static catch = (req, res, next) => {
		next(new APIError(`This route is not found: ${req.originalUrl}`, 404));
	}
};

module.exports = NotFoundRoutesHandler;