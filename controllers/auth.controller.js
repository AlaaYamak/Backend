const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const APIError = require('../error-handlers/api-error');

class AuthController {
	jwtSecret = process.env.JWT_SECRET;

	login = async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });
			if (!user || !bcrypt.compareSync(password, user.password)) {
				throw new APIError('Invalid email or password', 400);
			}
			const token = jwt.sign({ userId: user._id }, this.jwtSecret, { expiresIn: '3h' });
			res.status(200).json({ 
				state: 'Success',
				message: 'Login successfully',
				data: [
					{
						user: {
							_id: user._id,
							username: user.username,
							email: user.email
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
			const newUser = new User({ username, email, password: hashedPassword });
			await newUser.save();
			res.status(201).json({ 
				state: 'Success',
				message: 'Signup successfully',
				data: [
					{
						_id: newUser._id,
						username,
						email
					}
				]
			});
		}
		catch(error) {
			next(error);
		}
	};
};

module.exports = AuthController;