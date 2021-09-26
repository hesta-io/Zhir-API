const db = require('../../../database/connection');

module.exports = {
	duplicateUsernameValidator: async (username = '') => db('user').count('id as count')
		.where('username', username)
		.then(([d]) => {
			if (d.count > 0) {
				return Promise.reject(new Error('duplicate username detected try another one'));
			}
			return Promise.resolve(true);
		}),
};
