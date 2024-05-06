const APIError = require('../error-handlers/api-error');

class FitBitOAuth {
	clientId = process.env.FIT_BIT_CLIENT_ID;
	clientSecret = process.env.FIT_BIT_CLIENT_SECRET;
	fitBitScopesUrl = {
		activity: 'activities/goals/daily.json', // daily or weekly
		heartrate: 'activities/heart/date/today/1d.json', 
		sleep: 'sleep/date/today.json', 
		weight: 'body/log/weight/date/today.json',
	};

	getAccessToken = async(code, redirectUrl) => {
		try {
			const params = new URLSearchParams({
				client_id: this.clientId,
				client_secret: this.clientSecret,
				code,
				redirect_uri: redirectUrl,
				grant_type: 'authorization_code'
			});

			const response = await fetch ('https://api.fitbit.com/oauth2/token', {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': `Basic ${Buffer.from(this.clientId+ ':' + this.clientSecret).toString('base64')}`
				},
				method :'POST',
				body: params
			});
			const result = await response.json();
			return {
				accessToken: result.access_token,
				refreshToken: result.refresh_token,
				fitBitUserId: result.user_id,
				scopes: result.scope.split(' ').map(scope => this.fitBitScopesUrl[scope])
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
		return await response.json();
	};
};

module.exports = FitBitOAuth;