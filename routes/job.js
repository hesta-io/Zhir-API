// import { v4: uuidV4 } from 'uuid';

const express = require('express');
const uniqid = require('uniqid');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const uploader = require('../helpers/aws/putObjects');
const {
	createValidator,
	readSingleJobValidator,
	rateJobValidator,
	createExternalValidator,
} = require('../middlewares/validators/job');

const options = require('../helpers/options');
const db = require('../database/connection');
const userJWT = require('../middlewares/jwt/user');
const isValidAPIKey = require('../helpers/isValidAPIKey');

dayjs.extend(utc);
const pricePerPage = options.price_per_page;

const router = express();

async function createJob(body, user) {
	const filesWithPath = body.files.map((f) => ({
		...f,
		path: `original/${user ? user.id : -1}/${body.job_id}`,
	}));
	// const imageRequests = await uploader(filesWithPath);
	// const pages = filesWithPath.map((f) => {
	// 	let id = uuidV4();
	// 	return {
	// 		id,
	// 		name: `${f.index}.${f.extention}`,
	// 		job_id: body.job_id,
	// 		user_id: req.session.user ? req.session.user.id : -1,
	// 		created_by: req.user ? req.user.id : -1,
	// 		created_at: db.fn.now(),
	// 	};
	// });

	return uploader(filesWithPath)
		.then(() => db('job')
			.insert({
				id: body.job_id,
				code: uniqid.time(),
				name: body.group_name || uniqid.time(),
				lang: body.lang || 'ckb',
				status: 'pending',
				user_id: user ? user.id : -1,
				page_count: body.files.length,
				price_per_page: pricePerPage,
				from_api: user.from_api ? 1 : 0,
				callback: body.callback,
				created_at: dayjs.utc().format('YYYY-MM-D H:m:s'),
				created_by: user ? user.id : -1,
			})
			// return db.batchInsert('page', pages, 200);
			.then(([id]) => id)
			.catch(() => Promise.reject(
				new Error('هەڵەیەک رویدا لەکاتی دروستکرنی کردار'),
			)))
		.catch((e) => Promise.reject(new Error(e.toString())));
}
async function rateJob(body, req) {
	const { params } = req;
	return db('job')
		.update({
			rate: body.rate,
		})
		.where('id', params.job_id)
		.then(() => params.job_id);
}
async function readJobList(limit, offset, userId = 0) {
	await db.raw('set transaction isolation level read uncommitted;');
	return db('job')
		.select(
			'job.id',
			'job.name',
			'job.code',
			'job.user_id',
			'job.page_count',
			'job.paid_page_count',
			'job.user_failing_reason',
			'job.status',
			'job.lang',
			'job.queued_at',
			'job.processed_at',
			'job.finished_at',
			'job.created_at',
			'job.deleted',
			'job.created_by',
			'job.rate',
			'job.from_api',
			'job.callback',
		)
		.where('user_id', userId)
		.andWhereRaw(' created_at BETWEEN NOW() - INTERVAL 30 DAY AND NOW() ')
		.orderBy('created_at', 'desc')
		.limit(limit)
		.offset(offset);
}
async function readSingleJob(jobId = 0, userId = 0) {
	return db('job')
		.select(
			'job.id',
			'job.name',
			'job.code',
			'job.user_id',
			'job.page_count',
			'job.paid_page_count',
			'job.user_failing_reason',
			'job.status',
			'job.lang',
			'job.queued_at',
			'job.processed_at',
			'job.finished_at',
			'job.created_at',
			'job.deleted',
			'job.created_by',
			'job.rate',
			'job.from_api',
			'job.callback',
		)
		.where('user_id', userId)
		.andWhere('id', jobId)
		.limit(1)
		.then(async ([job]) => {
			if (job) {
				const mutatedJob = job;
				const pages = await db('page').select().where('job_id', job.id);
				mutatedJob.pages = pages;
				return Promise.resolve(mutatedJob);
			}
			return Promise.resolve(null);
		});
}
router.post('/', userJWT, createValidator, async (req, res) => {
	createJob(req.body, req.session.user)
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
		createJob(req.body, req.user)
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
	readJobList(100, 0, req.user.id)
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
		readSingleJob(req.params.job_id, req.user.id)
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
		rateJob(req.body, req)
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
	readJobList(100, 0, req.session.user.id)
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
	readSingleJob(req.params.job_id, req.session.user.id)
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
