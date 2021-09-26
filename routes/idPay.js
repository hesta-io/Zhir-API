/* eslint-disable eqeqeq */
const express = require('express');
const superagent = require('superagent');
const userJWT = require('../middlewares/jwt/user');
const { payValidator, verifyValidator } = require('../middlewares/validators/idPay');

const db = require('../database/connection');

let agent = superagent.agent();
agent = agent.set('Content-Type', 'application/json');
agent = agent.set('X-API-KEY', process.env.IDPAY_AUTH_KEY);
if (process.env.IDPAY_SANDBOX === 1) {
	agent = agent.set('X-SANDBOX', 1);
}

function generateTransaction(object = {}) {
	return db('user_transaction')
		.insert(object)
		.then(([d]) => d);
}
function setPaymentTransactionId(id, paymentTransactionId) {
	return db('user_transaction')
		.update({ transaction_id: paymentTransactionId })
		.where('id', id)
		.then(() => id);
}
function confirmTransaction(id, paymentTransactionId) {
	return db('user_transaction')
		.update({ confirmed: 1, admin_note: 'confirmed' })
		.where('id', id)
		.andWhere('transaction_id', paymentTransactionId)
		.then(() => db('user')
			.select('user.*')
			.innerJoin(
				'user_transaction',
				'user_transaction.user_id',
				'user.id',
			)
			.andWhere(
				'user_transaction.transaction_id',
				paymentTransactionId,
			)
			.andWhere('user_transaction.id', id)
			.andWhere('user.active', 1)
			.andWhere('user.deleted', 0)
			.limit(1));
}
// offical currency is rial which have one more 0 that tuman
const prices = {
	400000: 50,
	700000: 100,
	2500000: 500,
	4000000: 1000,
};
const router = express();
router.post('/verify', verifyValidator, (req, res) => {
	// Transaction Status link  https://idpay.ir/web-service/v1.1/?javascript#ad39f18522
	const { body } = req;
	if (body.status === 10) {
		// do transaction confirmation here
		agent
			.post('https://api.idpay.ir/v1.1/payment/verify')
			.send({
				id: body.id,
				order_id: body.order_id,
			})
			.end(async (err) => {
				if (!err) {
					const [user] = await confirmTransaction(
						body.order_id,
						body.id,
					);
					if (user) {
						delete user.salt;
						delete user.password;
						delete user.tmp_password;
						req.session.user = user;
						res.redirect('/app/balance?success=1');
					} else {
						res.redirect('/app/balance?fail=1');
					}
				} else {
					res.json({
						msg: 'هەڵەیەک رویدا لەکاتی دڵنیابوونەوە لە پارەدان',
					});
				}
			});
	} else if (body.status == 1) {
		res.json({ msg: 'Payment not maid' });
	} else if (body.status == 2) {
		res.json({ msg: 'Payment failed' });
	} else if (body.status == 3) {
		res.json({ msg: 'An error has occurred' });
	} else if (body.status == 4) {
		res.json({ msg: 'Blocked' });
	} else if (body.status == 5) {
		res.json({ msg: 'Return to payer' });
	} else if (body.status == 6) {
		res.json({ msg: 'Reversed system' });
	} else if (body.status == 7) {
		res.redirect('/app/recharge');
	} else if (body.status == 8) {
		res.json({ msg: 'Moved to payment gateway' });
	} else if (body.status == 100) {
		res.redirect('/app/balance');
	} else if (body.status == 101) {
		res.json({ msg: 'Payment has already been approved' });
	} else if (body.status == 200) {
		res.json({ msg: 'Deposited to the recipient' });
	}
});
router.get('/pay/:amount', userJWT, payValidator, async (req, res) => {
	const { params } = req;
	const { user } = req.session;
	const orderId = await generateTransaction({
		user_id: user.id,
		type_id: 1,
		payment_medium_id: 6, // IDPay medium
		page_count: prices[params.amount],
		amount: params.amount,
		transaction_id: null,
		created_by: user.id,
		confirmed: 0,
		created_at: db.fn.now(),
		admin_note: 'draft',
	});
	agent
		.post('https://api.idpay.ir/v1.1/payment')
		.send({
			order_id: orderId,
			amount: params.amount,
			name: user.name,
			phone: user.phone_no,
			mail: user.email,
			desc: ' ',
			callback: `${process.env.DOMAIN}/api/payment/idpay/verify`,
		})
		.end(async (err, r) => {
			if (!err) {
				const { body } = r;
				await setPaymentTransactionId(orderId, body.id);
				res.redirect(body.link);
			} else {
				res.json({
					msg:
						'هەڵەیەک رویدا لەکاتی جێبەجێکردنی کردارەکان، دووبارە هەوڵبدەرەوە',
				});
			}
		});
});

module.exports = router;
