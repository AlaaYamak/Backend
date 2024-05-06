const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const googleFitRouter = require('./routes/google-fit.route');
const fitBitRouter = require('./routes/fit-bit.route');

const router = (app) => {
	app.use('/auth', authRouter);
	app.use('/user', userRouter);
	app.use('/google-fit', googleFitRouter);
	app.use('/fit-bit', fitBitRouter);
}

module.exports = router;