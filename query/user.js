const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

async function readUserBalanceQuery(userId = 0) {
	return db('user_transaction')
		.sum('page_count as page_count')
		.where('user_id', userId)
		.where('confirmed', 1)
		.then(([d]) => d);
}
function readTransactionListQuery(userId = 0, limit = 20, offset = 0) {
	return db('user_transaction')
		.select(
			'user_transaction.type_id',
			'user_transaction.payment_medium_id',
			'user_transaction.page_count',
			'user_transaction.amount',
			'user_transaction.transaction_id',
			'user_transaction.user_note',
			'user_transaction.created_at',
			'payment_medium.name as payment_medium_name',
			'payment_medium.code as payment_medium_code',
			'payment_medium.currency_symbol as payment_medium_currency_symbol',
		)
		.leftJoin(
			'payment_medium',
			'payment_medium.id',
			'user_transaction.payment_medium_id',
		)
		.andWhere('user_transaction.user_id', userId)
		.andWhere('user_transaction.type_id', 1) // only recharges are considered
		.andWhere('user_transaction.confirmed', 1) // only confirmed recharges are considered
		.orderBy('user_transaction.id', 'desc')
		.limit(limit)
		.offset(offset);
}
function readSingleUserQuery(userId = 0) {
	return db('user')
		.select(
			'id',
			'name',
			'company_name',
			'email',
			'gender',
			'birthdate',
			'phone_no',
			'uid',
			'api_key',
			'can_use_api',
			'monthly_recharge',
		)
		.where('id', userId)
		.then(([data]) => data);
}
function updateUserQuery(body, userId = 0) {
	const updateObject = {
		name: body.name,
		email: body.email,
		phone_no: body.phone_no,
		company_name: body.company_name,
	};
	if (body.password) {
		const salt = uuidv4();
		updateObject.password = sha1(`${salt}${body.password}`);
		updateObject.salt = salt;
	}
	return db('user').update(updateObject).where('id', userId);
}

module.exports = {
	readUserBalanceQuery,
	readTransactionListQuery,
	readSingleUserQuery,
	updateUserQuery,
};
