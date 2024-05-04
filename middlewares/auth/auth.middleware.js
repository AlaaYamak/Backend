const jwt = require('jsonwebtoken');
const APIError = require('../../error-handlers/api-error');

class AuthMiddleware {
	static jwtSecret = process.env.JWT_SECRET;

	static authenticate = (req, res, next) => {
		try {
			const token = req.headers.authorization?.split(' ');
			if(!token || token[0].toLowerCase() !== 'bearer') {
				throw new APIError('Invalid token', 401);
			}
			const decodedToken = jwt.verify(token[1], AuthMiddleware.jwtSecret);
			req.user = decodedToken;
			next(); 
		} 
		catch (error) {
			if(error.message === 'jwt expired') {
				error.message = 'Your token has been expired';
				error.statusCode = 401;
			}
			next(error)
		}
	}
}

module.exports=AuthMiddleware;