const db = require('knex');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../../', '.env') });

module.exports = db({
	client: 'mysql',
	connection: {
		host: process.env.HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		debug: false,
	},
	port: 80,
});
