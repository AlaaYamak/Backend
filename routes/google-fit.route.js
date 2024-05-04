const express = require ('express');
const AuthMiddleware = require('../middlewares/auth/auth.middleware');
const connectValidation = require('../middlewares/express-validation/google-fit.validation.middleware')
const GoogleFitController = require ('../controllers/google-fit.controller');

const googleFitRouter = express.Router();
const {connect, fetch, disconnect} = new GoogleFitController();

googleFitRouter.post('/connect', AuthMiddleware.authenticate, connectValidation, connect);
googleFitRouter.post('/fetch', AuthMiddleware.authenticate, fetch);
googleFitRouter.delete('/disconnect', AuthMiddleware.authenticate, disconnect);

module.exports= googleFitRouter;

