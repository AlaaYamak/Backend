const APIError = require('../error-handlers/api-error');

class GoogleFitOAuth {
	clientId = process.env.GOOGLE_FIT_CLIENT_ID;
	clientSecret = process.env.GOOGLE_FIT_CLIENT_SECRET;

	getAccessToken = async(code, redirectUrl) => {
		try {
			const response = await fetch ('https://oauth2.googleapis.com/token', {
				headers : {
					'Content-Type': 'application/json'
				},
				method :'POST',
				body: JSON.stringify({
					client_id: this.clientId,
					client_secret: this.clientSecret,
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
	
	getData = async(scopeUrl, accessToken) => {
		const response = await fetch(scopeUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'GET'
		});
		return await response.text();
	};
};

module.exports = GoogleFitOAuth;