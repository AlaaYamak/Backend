const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const googleFitRouter = require('./routes/google-fit.route');

const router = (app) => {
	app.use('/auth', authRouter);
	app.use('/user', userRouter);
	app.use('/google-fit', googleFitRouter);
}

module.exports = router;