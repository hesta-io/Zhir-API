const { body, param } = require('express-validator');

const prettyBytes = require('pretty-bytes');
const validate = require('./validate');

const {
	checkUserActiveJobs,
	balanceValidator,
	rateJobValidator: rateJobDataValidator,
} = require('./data/job');

const maxFileSize = 1.2e+7; // file limit is now 12mb
const allowedImageTypes = [
	'image/jpg',
	'image/jpeg',
	'image/jfif',
	'image/png',
	'image/webp',
	'image/bmp',
	'image/tiff',
	'image/pjpeg',
	'image/tif',
	'image/png',
];
module.exports = {
	createValidator: [
		body('job_id')
			.exists()
			.isUUID()
			.withMessage('ئایدی دروستکراو هەڵەیە')
			.custom((v, { req }) => checkUserActiveJobs(req.user.id)),
		body('group_name').exists().isString(),
		body('lang').exists().isString(),
		body('files')
			.exists()
			.withMessage('key does not exist')
			.isArray({ min: 1 })
			.withMessage('دەبێت بەلایەنی کەم فایلێک بنێریت')
			.isArray({ max: 100 })
			.withMessage('دەبێت کەمتر لە 100 فایل هەڵبژێریت بۆ هەر جارێک')
			.custom((v, { req }) => balanceValidator(req.user.id, v)),
		body('files.*.name').exists().trim().isString(),
		body('files.*.index').exists().isInt(),
		body('files.*.extention').exists().isString(),
		body('files.*.type')
			.exists()
			.trim()
			.isString()
			.isIn(allowedImageTypes)
			.withMessage('ئەم جۆرە فایلە رێگەپێدراو نیە'),
		body('files.*.base64')
			.exists()
			.trim()
			.isString()
			.isLength({ max: maxFileSize })
			.withMessage(
				`گەورەترین قەبارەی فایل بریتیە لە ${prettyBytes(maxFileSize)}`,
			),
		validate,
	],
	createExternalValidator: [
		body('job_id').exists().isUUID().withMessage('ئایدی دروستکراو هەڵەیە'),
		body('group_name').exists().isString(),
		body('lang').exists().isString(),
		body('files')
			.exists()
			.withMessage('key does not exist')
			.isArray({ min: 1 })
			.withMessage('دەبێت بەلایەنی کەم فایلێک بنێریت')
			.isArray({ max: 100 })
			.withMessage('دەبێت کەمتر لە 100 فایل هەڵبژێریت بۆ هەر جارێک')
			.custom((v, { req }) => balanceValidator(req.user.id, v)),
		body('files.*.name').exists().trim().isString(),
		body('files.*.index').exists().isInt(),
		body('files.*.extention').exists().isString(),
		body('files.*.type')
			.exists()
			.trim()
			.isString()
			.isIn(allowedImageTypes)
			.withMessage('ئەم جۆرە فایلە رێگەپێدراو نیە'),
		body('files.*.base64')
			.exists()
			.trim()
			.isString()
			.isLength({ max: maxFileSize })
			.withMessage(
				`گەورەترین قەبارەی فایل بریتیە لە ${prettyBytes(maxFileSize)}`,
			),
		body('callback')
			.exists()
			.isString()
			.withMessage('callback must be a valid url'),
		validate,
	],
	readSingleJobValidator: [param('job_id').exists().isUUID(), validate],
	rateJobValidator: [
		param('job_id')
			.exists()
			.isUUID()
			.custom((v, { req }) => rateJobDataValidator(req.user.id, v)),
		body('rate')
			.exists()
			.isIn([1, 2, 3, 4, 5])
			.withMessage(
				'هەڵەیەک رویدا لەکاتی دەنگدان، ژمارەیەکی هەڵە نێردراوە',
			),
		validate,
	],
};
