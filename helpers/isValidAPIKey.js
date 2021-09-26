const db = require('../database/connection');

function isValidAPIKey(req, res, next) {
	const apiKey = req.headers['x-api-key'];
	if (!apiKey) {
		res.status(401).json({
			msg: 'API Key is missing  please set x-api-key header ',
		});
	} else {
		db('user')
			.select()
			.where('api_key', apiKey)
			.where('active', 1)
			.where('deleted', 0)
			.limit(1)
			.then(([user]) => {
				const mutatedUser = user;
				if (user) {
					req.user = user;
					mutatedUser.from_api = 1;
					const isSandbox = req.headers['is-sandbox'];
					if (isSandbox === 1) mutatedUser.is_sandbox = 1;
					next();
				} else {
					res.status(401).json({
						msg:
							'Invalid API key or the user is blocked from using the api contact support or call 0750 7665935',
					});
				}
			});
	}
}
module.exports = isValidAPIKey;
