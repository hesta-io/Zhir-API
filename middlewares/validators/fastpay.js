const { query } = require('express-validator');

const validate = require('./validate');

module.exports = {
	fastpayRechargeValidator: [
		query('amount').exists()
			.isIn(['8000', '30000', '50000', 5000, 30000, 50000])
			.withMessage('invalid purchase amount'),
		validate,
	],

};
