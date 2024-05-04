const express= require('express');
const {signupValidation, loginValidation} = require('../middlewares/express-validation/user.validation.middleware');
const AuthController = require ('../controllers/auth.controller');

const authRouter = express.Router();
const {login, signup} = new AuthController();

authRouter.post('/login', loginValidation, login);
authRouter.post('/signup', signupValidation, signup);

module.exports =authRouter;