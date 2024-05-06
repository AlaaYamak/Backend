const {body} = require('express-validator');
const ExpressErrorValidator = require('../../error-handlers/express-validator-error.handler');

const signupValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({min: 5}).withMessage('Password must be at least 5 characters'),
  
  ExpressErrorValidator.catchExpressValidatorErrors
];

const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  ExpressErrorValidator.catchExpressValidatorErrors
];

const refreshTokenValidation = [
  body('accessToken')
    .notEmpty().withMessage('Access token is required')
    .isJWT().withMessage('Invalid access token'),

  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
    .isJWT().withMessage('Invalid refresh token'),
];

module.exports = {signupValidation, loginValidation, refreshTokenValidation};