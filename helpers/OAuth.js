const APIError = require('../error-handlers/api-error');
class OAuth {
	static clientId = process.env.CLIENT_ID;
	static clientSecret = process.env.CLIENT_SECRET;

	static getAccessToken = async(code, redirectUrl) => {
		try {
			const response = await fetch ('https://oauth2.googleapis.com/token', {
				headers : {
					'Content-Type': 'application/json'
				},
				method :'POST',
				body: JSON.stringify({
					client_id: OAuth.clientId,
					client_secret: OAuth.clientSecret,
					code,
					redirect_uri: redirectUrl,
					grant_type: "authorization_code"
				})
			});
			const result = await response.json();
			return {
				accessToken: result.access_token,
				scopes: result.scope.split(' ')
			};
		}
		catch(error) {
			throw new APIError('Something went wrong, please try to get another code or confirm on redirect url and try again', 400);
		}
	};
	
	static getData =async (scopeUrl, accessToken) => {
		const response = await fetch (scopeUrl, {
			header :{
				Authorization :`Bearer ${accessToken}`
			},
			method :'GET'
		})
		return await response.text();
	};
};

module.exports = OAuth;