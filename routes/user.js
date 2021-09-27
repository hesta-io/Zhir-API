const express = require('express');

const { updateValidator } = require('../middlewares/validators/user');
const {
	readUserBalanceQuery,
	readTransactionListQuery,
	readSingleUserQuery,
	updateUserQuery,
} = require('../query/user');

const router = express();

router.put('/', updateValidator, (req, res) => {
	updateUserQuery(req.body, req.user.id)
		.then(() => {
			res.json({ msg: 'پرۆفایلەکەت بە سەرکەوتووی نوێکرایەوە' });
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک ڕوویدا لە کاتی نوێکردنەوەی پرۆفایلەکەت',
			});
		});
});

router.get('/', (req, res) => {
	readSingleUserQuery(req.user.id)
		.then((data) => {
			res.json(data);
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک ڕوویدا لەکاتی وەرگرتنەوەی زانیاری بەکارهێنەر',
			});
		});
});
router.get('/balance', (req, res) => {
	readUserBalanceQuery(req.user.id)
		.then((data) => {
			res.json(data);
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک ڕوویدا لەکاتی گەراندنەوەی باڵانسی بەکارهێنەر',
			});
		});
});
router.get('/transactions', (req, res) => {
	readTransactionListQuery(req.user.id, 20, 0)
		.then((data) => {
			res.json(data);
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک رویدا لەکاتی وەرگرتنەوەی دواین پارەدانەکان',
			});
		});
});

module.exports = router;
