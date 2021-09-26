const { RateLimiterMySQL } = require('rate-limiter-flexible');
const db = require('../database/connection');

const rateLimiter = new RateLimiterMySQL({
	blockDuration: 7200, // 2h
	storeClient: db,
	storeType: 'knex',
	keyPrefix: 'middleware',
	dbName: process.env.DB_NAME,
	tableName: 'rate_limit',
	points: 20, // 10 requests
	duration: 2, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter
		.consume(req.ip, 1)
		.then(() => {
			next();
		})
		.catch(() => {
			res.status(429).json({
				msg:
					'بۆ ماوەی ٢ کاتژمێر بڵۆک کرایت بەهۆی ناردنی داواکاری زۆرەوە',
			});
		});
};
module.exports = rateLimiterMiddleware;
