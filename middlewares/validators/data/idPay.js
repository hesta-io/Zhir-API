const db = require('../../../database/connection');

async function checkDuplicateTransactionId(
	transactionId = 0,
	paymentTransactionId = 0,
) {
	const [transaction] = await db('user_transaction')
		.count('id as count')
		.where('id', transactionId)
		.andWhere('transaction_id', paymentTransactionId)
		.andWhere('confirmed', 1);
	if (transaction && transaction.count > 1) {
		return Promise.reject(
			new Error('ناتوانیت هەمان ID بەکارببەیت بۆ دووبارە پارەدانەوە'),
		);
	}
	return Promise.resolve(true);
}

module.exports = {
	checkDuplicateTransactionId,
};
