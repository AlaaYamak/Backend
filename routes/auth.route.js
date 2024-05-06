const express= require('express');
const {signupValidation, loginValidation, refreshTokenValidation} = require('../middlewares/express-validation/user.validation.middleware');
const AuthController = require ('../controllers/auth.controller');

const authRouter = express.Router();
const {login, signup, refreshToken} = new AuthController();

authRouter.post('/login', loginValidation, login);
authRouter.post('/signup', signupValidation, signup);
authRouter.post('/refresh-token', refreshTokenValidation, refreshToken);

module.exports = authRouter;