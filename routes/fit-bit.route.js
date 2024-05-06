const express = require ('express');
const AuthMiddleware = require('../middlewares/auth/auth.middleware');
const connectValidation = require('../middlewares/express-validation/google-fit.validation.middleware')
const FitBitController = require ('../controllers/fit-bit.controller');

const fitBItRouter = express.Router();
const {connect, fetch, disconnect} = new FitBitController();

fitBItRouter.post('/connect', AuthMiddleware.authenticate, connectValidation, connect);
fitBItRouter.get('/fetch', AuthMiddleware.authenticate, fetch);
fitBItRouter.delete('/disconnect', AuthMiddleware.authenticate, disconnect);

module.exports = fitBItRouter;