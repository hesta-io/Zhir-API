const jwt = require('jsonwebtoken');
const db = require('../../database/connection');

module.exports = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		const parts = (authorization) ? authorization.split(' ') : [];
		if (parts[1]) {
			try {
				const decoded = jwt.verify(parts[1], process.env.USER_JWT_SECRET);
				// req.customer = decoded;
				req.user = {
					...decoded.data,
					token: parts[1],
				};
				const [user] = await db('user').select()
					.where('active', 1)
					.where('deleted', 0)
					.andWhere('id', req.user.id)
					.limit(1);
				if (user) {
					next();
				} else {
					res.status(401).json({
						msg: 'Your account is not active, contact customer support ',
					});
				}
			} catch (err) {
				res.status(401).json({
					msg: err.toString(),
				});
			}
		} else {
			res.status(401).json({
				msg: 'invalid token provided',
			});
		}
	} catch (err) {
		res.status(401).json({
			msg: err.toString(),
		});
	}
};
