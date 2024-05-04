const {validationResult} = require('express-validator');
const APIError = require('./api-error');

class ExpressErrorValidator {
	static catchExpressValidatorErrors(request, response, next) {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map(error => error.msg);
			throw new APIError(errorMessages, 400);
		}
		next();
	}
}

module.exports = ExpressErrorValidator;