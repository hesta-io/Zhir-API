const db = require('../../../database/connection');

async function balanceValidator(userId = 0, files = []) {
	const [pages] = await db('user_transaction')
		.select(db.raw('SUM(COALESCE(page_count, 0)) as totalPages'))
		.andWhere('user_id', userId)
		.andWhere('confirmed', 1);
	if (pages && pages.totalPages > 0 && pages.totalPages >= files.length) {
		return Promise.resolve(true);
	}
	return Promise.reject(
		new Error(
			'تکایە باڵانس پربکەرەوە باڵانسی ماوە کەمترە لە ژمارەی فایلەکان',
		),
	);
}
async function checkUserActiveJobs(userId = 0) {
	const [jobs] = await db('job')
		.count('id as count')
		.whereIn('status', ['pending', 'queued', 'processing'])
		.andWhere('user_id', userId);
	if (jobs && jobs.count < 3) {
		return Promise.resolve(true);
	}
	return Promise.reject(
		new Error('تکایە چاوەروان بە تاوەکو ٣ کردارەکەی دیکەت تەواو دەبن'),
	);
}
async function rateJobValidator(userId = 0, jobId = 0) {
	const [job] = await db('job')
		.select()
		.andWhere('user_id', userId)
		.andWhere('id', jobId)
		.limit(1);
	if (job) {
		if (job.status === 'completed') {
			if (job.rate > 0) {
				return Promise.reject(
					new Error(
						'ئەم سکانە هەڵسەنگانی بۆ کراوە ناتوانیت دوبارە کردارەکە ئەنجام بدەیتەوە',
					),
				);
			}
		} else {
			return Promise.reject(
				new Error(
					'ناتوانیت هەڵسەنگاندن بۆ کردارێک بکەیت کە تەواو نەبووە',
				),
			);
		}
		return Promise.resolve(true);
	}
	return Promise.reject(
		new Error('تۆ ئەم سکانەت دروست نەکردوە یان هەڵەیەک رویدا'),
	);
}

module.exports = {
	rateJobValidator,
	checkUserActiveJobs,
	balanceValidator,
};
