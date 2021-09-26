const { body } = require('express-validator');
const validate = require('../validate');

const maxFileSize = 4e+6;
module.exports = {
	putObjectsValidator: [
		body('files')
			.exists().withMessage('key does not exist')
			.isArray({ min: 1 })
			.withMessage('input should be an array with at least one elemnt'),
		body('files.*.name')
			.exists()
			.trim()
			.isString(),
		body('files.*.type')
			.exists()
			.trim()
			.isString()
			.isIn([
				'image/png',
				'image/jpeg',
				'image/pjpeg',
				'image/gif',
				'application/x-compressed',
				'application/x-zip-compressed',
				'application/zip',
				'multipart/x-zip',
				'audio/mpeg3',
				'audio/x-mpeg-3',
				'video/mpeg',
				'video/x-mpeg',
				'audio/mpeg',
				'application/pdf',
				'application/msword',
				'application/excel',
			])
			.withMessage('file type not allowed'),
		body('files.*.base64')
			.exists()
			.trim()
			.isString()
			.isLength({ max: maxFileSize })
			.withMessage('maximum file size excceded 6mb'),
		validate,
	],
	deleteObjectsValidator: [
		body('files')
			.exists().withMessage('key does not exist')
			.isArray({ min: 1 })
			.withMessage('input should be an array with at least one elemnt'),
		body('files.*')
			.exists()
			.trim()
			.isString(),
		validate,
	],

};
