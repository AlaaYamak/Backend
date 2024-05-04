const express = require ('express');
const AuthMiddleware = require('../middlewares/auth/auth.middleware');
const UserController = require ('../controllers/user.controller');

const userRouter = express.Router();
const {getProfile} = new UserController();

userRouter.get('/profile', AuthMiddleware.authenticate, getProfile);

module.exports= userRouter;

