const { body, param } = require('express-validator');

const { checkDuplicateTransactionId } = require('./data/idPay');
const validate = require('./validate');

module.exports = {
	payValidator: [
		param('amount')
			.exists()
			.isIn([400000, 2500000, 700000, 4000000])
			.withMessage('بڕی پارەی نێردراو هەڵەیە'),

		validate,
	],
	verifyValidator: [
		body('id').exists(),
		body('order_id')
			.exists()
			.custom((v, { req }) => checkDuplicateTransactionId(v, req.body.id)),
		validate,
	],
};
