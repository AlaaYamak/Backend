const User = require('../models/User');
const APIError = require('../error-handlers/api-error');

class UserController {
	getProfile = async (req, res, next) => {
		try {
			const {userId} = req.user;
			const user = await User.findById(userId);
			if (!user) {
				new APIError('This user does not exist', 404)
			}
			res.status(200).json({
				state: 'Success',
				message: 'User profile is retrieved successfully',
				data: [
					{
						_id: user._id,
						username: user.username,
						email: user.email
					}
				]
			});
		}
		catch(error) {
			next(error);
		}
	};
};

module.exports = UserController;
