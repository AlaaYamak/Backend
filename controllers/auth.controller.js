const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const APIError = require('../error-handlers/api-error');

class AuthController {
	accessTokenJwtSecret = process.env.ACCESS_TOKEN_JWT_SECRET;
	refreshTokenJwtSecret = process.env.REFRESH_TOKEN_JWT_SECRET;

	isRefreshTokenExpiredSoon = (refreshToken) => {
    const {exp} = jwt.decode(refreshToken);
    if(exp) {
      const secondsRemaining = exp - Math.floor(Date.now() / 1000);
      const daysRemaining = Math.ceil(secondsRemaining / 86400); // 60 * 60 * 24 = 86400 sec per day
      if(daysRemaining < 3) {
        return true;
      }
    }
    return false;
  };

	login = async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });
			if (!user || !bcrypt.compareSync(password, user.password)) {
				throw new APIError('Invalid email or password', 400);
			}
			const token = jwt.sign({ userId: user._id }, this.accessTokenJwtSecret, { expiresIn: '1m' });
			res.status(200).json({ 
				state: 'Success',
				message: 'Login successfully',
				data: [
					{
						user: {
							_id: user._id,
							username: user.username,
							email: user.email,
							refreshToken: user.refreshToken
						},
						token
					}
				]
			});
		}
		catch(error) {
			next(error);
		}
	};
	
	signup = async (req, res, next) => { 
		try {
			const { username, email, password } = req.body;
			const isEmailExist = await User.findOne({ email });
			if (isEmailExist) {
				next(new APIError('This email already exists', 400));
				return;
			}
			const hashedPassword = bcrypt.hashSync(password, 10);
			const refreshToken = jwt.sign({ username, email }, this.refreshTokenJwtSecret, { expiresIn: '30d' });
			const newUser = new User({ username, email, password: hashedPassword, refreshToken });
			await newUser.save();
			res.status(201).json({ 
				state: 'Success',
				message: 'Signup successfully',
				data: [
					{
						_id: newUser._id,
						username,
						email,
						refreshToken
					}
				]
			});
		}
		catch(error) {
			next(error);
		}
	};

	refreshToken = async (req, res, next) => {
		try {
			let {accessToken, refreshToken} = req.body;
			jwt.verify(refreshToken, this.refreshTokenJwtSecret);
			const accessTokenPayload = jwt.decode(accessToken);
			const user = await User.findOne({
				_id: accessTokenPayload.userId
			});
			if(!user || user.refreshToken !== refreshToken) {
				throw new APIError('Invalid tokens, try to login again', 400);
			}
			if(this.isRefreshTokenExpiredSoon(refreshToken)) {
				refreshToken = jwt.sign({email: user.email, username: user.username}, this.refreshTokenJwtSecret);
				user.refreshToken = refreshToken;
				await user.save();
			};
			accessToken = jwt.sign({userId: user.id}, this.accessTokenJwtSecret);
			res.status(200).json({
				state: 'Success',
				message: 'Your access token is refreshed successfully',
				data: [
					{
						accessToken,
						refreshToken
					}
				]
			})
		}
		catch(error) {
			if(error.message === 'jwt expired') {
				error.message = 'Your refresh token has been expired, try to login again';
				error.statusCode = 400;
			}
			next(error);
		}
	};
};

module.exports = AuthController;