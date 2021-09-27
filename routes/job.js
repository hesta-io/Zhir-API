// import { v4: uuidV4 } from 'uuid';

const express = require('express');

const {
	createValidator,
	readSingleJobValidator,
	rateJobValidator,
	createExternalValidator,
} = require('../middlewares/validators/job');
const {
	createJobQuery,
	rateJobQuery,
	readJobListQuery,
	readSingleJobQuery,
} = require('../query/job');

const userJWT = require('../middlewares/jwt/user');
const isValidAPIKey = require('../helpers/isValidAPIKey');

const router = express();

router.post('/', userJWT, createValidator, async (req, res) => {
	createJobQuery(req.body, req.session.user)
		.then(() => {
			res.json({
				msg: 'کارەکە بە سەرکەوتووی نێردرا',
			});
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک لە ڕاژە ڕوویدا',
			});
		});
});
router.post(
	'/external',
	isValidAPIKey,
	createExternalValidator,
	async (req, res) => {
		createJobQuery(req.body, req.user)
			.then(() => {
				res.status(200).json({
					success: true,
					status: 200,
					msg: 'کارەکە بە سەرکەوتووی نێردرا',
				});
			})
			.catch((e) => {
				res.status(500).json({
					success: false,
					status: 500,
					msg: e.toString(),
				});
			});
	},
);

router.get('/external/list', isValidAPIKey, (req, res) => {
	readJobListQuery(100, 0, req.user.id)
		.then((data) => {
			res.json(data);
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک ڕوویدا لەکاتی گەراندنەوەی فایلەکان',
			});
		});
});
router.get(
	'/external/:job_id',
	isValidAPIKey,
	readSingleJobValidator,
	(req, res) => {
		readSingleJobQuery(req.params.job_id, req.user.id)
			.then((data) => {
				if (data) {
					res.json(data);
				} else {
					res.status(404).json({
						msg: 'کرداری داواکراو نەدۆزرایەوە',
					});
				}
			})
			.catch(() => {
				res.status(500).json({
					msg: 'هەڵەیەک ڕوویدا لەکاتی گەراندنەوەی فایلەکان',
				});
			});
	},
);
router.put(
	'/rate/:job_id',
	userJWT,
	rateJobValidator,
	async (req, res) => {
		rateJobQuery(req.body, req)
			.then(() => {
				res.json({
					msg: 'کارەکە بە سەرکەوتووی نێردرا',
				});
			})
			.catch(() => {
				res.status(500).json({
					msg: 'هەڵەیەک لە ڕاژە ڕوویدا',
				});
			});
	},
);
router.get('/list', userJWT, (req, res) => {
	readJobListQuery(100, 0, req.user.id)
		.then((data) => {
			res.json(data);
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک ڕوویدا لەکاتی گەراندنەوەی فایلەکان',
			});
		});
});

router.get('/:job_id', userJWT, readSingleJobValidator, (req, res) => {
	readSingleJobQuery(req.params.job_id, req.user.id)
		.then((data) => {
			if (data) {
				res.json(data);
			} else {
				res.status(404).json({ msg: 'کرداری داواکراو نەدۆزرایەوە' });
			}
		})
		.catch(() => {
			res.status(500).json({
				msg: 'هەڵەیەک ڕوویدا لەکاتی گەراندنەوەی فایلەکان',
			});
		});
});

module.exports = router;
