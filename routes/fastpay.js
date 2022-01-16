const express = require('express');
const superagent = require('superagent');

const md5 = require('md5');
const customerJWTValidator = require('../middlewares/jwt/user');
const {
	fastpayRechargeValidator,
} = require('../middlewares/validators/fastpay');
const db = require('../database/connection');

const router = express.Router();

/* -------------------- Fastpay Related Functions----------------- */
const fastpayPaymentMediumId = 2;
const fastpayTransactionTypeId = 1; // Balance Recharge

async function generateDraftTransaction(customerId = 0, body = {}) {
	const pages = {
		8000: 100,
		30000: 500,
		50000: 1000,
	};
	return db('user_transaction').insert({
		type_id: fastpayTransactionTypeId,
		payment_medium_id: fastpayPaymentMediumId,
		user_id: customerId,
		page_count: pages[body.amount] || 0,
		amount: body.amount,
		transaction_id: -1,
		user_note: 'پڕکردنەوەی باڵانس',
		confirmed: 0, // this is eqevelant to draft
		created_at: db.fn.now(),
		created_by: customerId,

	}).then(([id]) => id)
		.catch(() => -1);
}

async function updateDraftTransaction(transactionId = 0, paymentTransactionId, customerAccountNo = '') {
	return db('user_transaction').update({
		transaction_id: paymentTransactionId,
		admin_note: `Via Fastpay Account:${customerAccountNo}`,
	}).where(db.raw('md5(id)'), transactionId).then(() => 'Success')
		.catch(() => '/payment/fastpay/fail');
}

async function loadSingleTransaction(transactionId = 0) {
	// transactionId is md5 hashed due to new fastpay credentials
	return db('user_transaction').select()
		.where(db.raw('md5(id)'), transactionId)
		.limit(1)
		.then(([transaction]) => transaction);
}
async function completeDraftTransaction(transactionId = 0, fastpayTransactionId = 0) {
	return db('user_transaction')
		.update({
			confirmed: 1,
		})
		.where(db.raw('md5(id)'), transactionId)
		.andWhere('transaction_id', fastpayTransactionId)
		.then(() => transactionId);
}

async function initFastpayTransaction(orderId = '0', amount = '0') {
	return superagent.post(`${process.env.FASTPAY_API_URL}/api/v1/public/pgw/payment/initiation`)
		.set('Content-Type', 'application/json')
		.send({
			store_id: process.env.FASTPAY_STORE_ID,
			store_password: process.env.FASTPAY_MERCHANT_STORE_PASS,
			order_id: md5(orderId),
			cart: JSON.stringify([
				{
					name: 'Account Recharge',
					qty: 1,
					unit_price: amount,
					sub_total: amount,
				},
			]),
			bill_amount: Math.round(amount),
			currency: 'IQD',
		})
		.then((res) => {
			const { body } = res;
			if (body.code === 200) {
				return body.data.redirect_uri;
			}
			return -1;
		})
		.catch(() => -1);
}
async function validateFastpayTransaction(customerTransactionId = '0') {
	return superagent.post(`${process.env.FASTPAY_API_URL}/api/v1/public/pgw/payment/validate`)
		.set('Content-Type', 'application/json')
		.send({
			store_id: process.env.FASTPAY_STORE_ID,
			store_password: process.env.FASTPAY_MERCHANT_STORE_PASS,
			order_id: customerTransactionId,
		})
		.then(async (res) => {
			const { body } = res;

			if (`${body.code}` === '200') {
				await completeDraftTransaction(customerTransactionId, body.data.transaction_id);
			}
			return 1;
		})
		.catch(() => -1);
}

/* ----------------------------------------------------------------- */

router.all('/fail', async (req, res) => {
	// we can remove the draft transaction
	res.redirect(`${process.env.DOMAIN}?recharge-status=fail`);
});
router.all('/success', (req, res) => {
	res.redirect(`${process.env.DOMAIN}?recharge-status=success`);
});
router.all('/cancel', (req, res) => {
	res.redirect(`${process.env.DOMAIN}?recharge-status=fail`);
});

router.post('/ipn', async (req, res) => {
	/*
		gw_transaction_id: CUL1NUB731,
		merchant_order_id: 1,
		received_amount: 1000,
		currency: IQD,
		status: Success,
		customer_name: Aram Rafeq,
		customer_mobile_number: +9647507665935,
		at: 2020-11-26 13:54:01
   */
	const { body } = req;
	const {
		gw_transaction_id: fastpayTransactionId,
		merchant_order_id: customerTransactionId,
		received_amount: billAmount,
		customer_mobile_number: fastpayCustomerAccountno,
		status,
	} = body;
	if (status === 'Success') {
		const transaction = await loadSingleTransaction(customerTransactionId);
		if (transaction) {
			if (Math.abs(Math.round(transaction.amount) - Math.round(billAmount)) < 10) {
				await updateDraftTransaction(
					customerTransactionId,
					fastpayTransactionId,
					fastpayCustomerAccountno,
				);

				await validateFastpayTransaction(customerTransactionId);
				res.send('draft transaction updated');
			} else {
				res.send('transaction bill fails to validate');
			}
		} else {
			res.send('transaction fails');
		}
	} else {
		res.send('payment failed');
	}
});
router.get('/recharge', customerJWTValidator, fastpayRechargeValidator, async (req, res) => {
	const transactionId = await generateDraftTransaction(req.user.id, req.query);
	const paymentURL = await initFastpayTransaction(`${transactionId}`, parseInt(req.query.amount, 10));
	if (transactionId > -1) {
		if (typeof paymentURL === 'number' && paymentURL === -1) {
			res.redirect('/payment/fastpay/fail');
		} else {
			res.redirect(paymentURL);
		}
	} else {
		res.redirect('/payment/fastpay/fail');
	}
	// res.json({ msg: 'hello world' });
});

module.exports = router;
