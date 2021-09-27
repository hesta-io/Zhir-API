const uniqid = require('uniqid');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const db = require('../database/connection');
const uploader = require('../helpers/aws/putObjects');
const options = require('../helpers/options');

dayjs.extend(utc);
const pricePerPage = options.price_per_page;

async function createJobQuery(body, user) {
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
	// 		user_id: req.session.user ? req.user.id : -1,
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
async function rateJobQuery(body, req) {
	const { params } = req;
	return db('job')
		.update({
			rate: body.rate,
		})
		.where('id', params.job_id)
		.then(() => params.job_id);
}
async function readJobListQuery(limit, offset, userId = 0) {
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
async function readSingleJobQuery(jobId = 0, userId = 0) {
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

module.exports = {
	createJobQuery,
	rateJobQuery,
	readJobListQuery,
	readSingleJobQuery,
};
