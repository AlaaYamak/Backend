const {body} = require('express-validator');
const ExpressErrorValidator = require('../../error-handlers/express-validator-error.handler');

const connectValidation = [
  body("code")
    .notEmpty().withMessage("Code is required")
    .isString().withMessage("Code must be a string"),

  body("redirectUrl")
    .notEmpty().withMessage("RedirectUrl is required")
    .isString().withMessage('Redirect URL must be a string'),
  
  ExpressErrorValidator.catchExpressValidatorErrors
];

module.exports = connectValidation;