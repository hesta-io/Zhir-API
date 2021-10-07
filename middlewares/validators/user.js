const { body, param } = require('express-validator');

// const moment = require('moment');
const validate = require('./validate');
const blockedEmails = require('./blockedMailProviders');

const {
	duplicateEmailValidator,
	duplicateEmailUserUpdateValidator,
	duplicatePhoneNumberUserUpdateValidator,
} = require('./data/user');

// moment.suppressDeprecationWarnings = true;
function blockedEmailValidator(v, bEmails = blockedEmails) {
	let passed = true;
	// eslint-disable-next-line no-restricted-syntax
	for (const blockedEmail of bEmails) {
		if (`${v}`.includes(blockedEmail)) {
			passed = false;
			break;
		}
	}
	if (passed) return Promise.resolve(true);
	return Promise.reject(new Error('ئەم جۆرە ئیمەیڵە بلۆک کراوە'));
}
module.exports = {
	createValidator: [
		body('name')
			.exists()
			.withMessage('بوونی نیە')
			.trim()
			.isString()
			.withMessage('input is not a valid string'),
		body('company_name')
			.exists()
			.withMessage('بوونی نیە')
			.trim()
			.isString()
			.withMessage('input is not a valid string'),
		body('email')
			.exists()
			.withMessage('بوونی نیە')
			.trim()
			.isString()
			.withMessage('input is not a valid string')
			.custom((v) => duplicateEmailValidator(v))
			.custom((v) => blockedEmailValidator(v, blockedEmails)),

		body('password_retype').exists().withMessage('بوونی نیە'),
		body('password')
			.exists()
			.isString()
			.withMessage('input is not valid string')
			.isLength({ min: 3 })
			.withMessage('تێپەرەوشە دەبێت ٢ پیت بێت بەلایەنی کەم')
			.custom((value, { req }) => {
				if (value === req.body.password_retype && value !== '') {
					return Promise.resolve('success');
				}
				return Promise.reject(new Error('تێپەرەوشەکان جیاوازن'));
			}),
		validate,
	],
	updateValidator: [
		// param('user_id')
		// 	.exists()
		// 	.withMessage('key does not exisit')
		// 	.isInt()
		// 	.withMessage('input must be a valid integer'),
		body('name')
			.exists()
			.withMessage('بوونی نیە')
			.trim()
			.isString()
			.withMessage('input is not a valid string')
			.isLength({ min: 2 })
			.withMessage('ناوی بەکارهێنەر دەبێت بەلایەنی کەمەوە ٢ پیت بێت'),
		// body('gender')
		// 	.exists()
		// 	.withMessage('بوونی نیە')
		// 	.isIn(['male', 'female', 'unspecified']),
		// body('birthdate')
		// 	.exists()
		// 	.withMessage('بوونی نیە')
		// 	.custom((value) => {
		// 		const date = moment(value);
		// 		if (date.isValid()) {
		// 			if (moment(value).format('YYYY-MM-DD') === value) {
		// 				return Promise.resolve(true);
		// 			}
		// 			return Promise.reject(new Error('invalid date format'));
		// 		}
		// 		return Promise.reject(new Error('invalid date'));
		// 	}),
		// body('active')
		// 	.exists()
		// 	.withMessage('بوونی نیە')
		// 	.isBoolean()
		// 	.withMessage('input should be a valid boolean'),
		body('email')
			.exists()
			.withMessage('بوونی نیە')
			.trim()
			.isString()
			.custom((v, { req }) => duplicateEmailUserUpdateValidator(v, req.user))
			.custom((v) => blockedEmailValidator(v, blockedEmails)),
		body('phone_no')
			.exists()
			.trim()
			.isString()
			.matches(
				/^\+964[0-9][1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/i,
			)
			.withMessage(
				`ژمارەی مۆبایل دەبێت لەم شێوەیە بێت بۆ نموونە
			9647727903366+`,
			)
			.custom((v, { req }) => duplicatePhoneNumberUserUpdateValidator(v, req.user)),
		body('password_retype').optional().isString(),
		body('password')
			.optional()
			.isString()
			.isLength({ min: 3 })
			.withMessage('تێپەرەوشە دەبێت بەلایەنی کەم ٣ پیت بێت')
			.custom((value, { req }) => {
				if (value === req.body.password_retype && value !== '') {
					return Promise.resolve('success');
				}
				return Promise.reject(
					new Error(
						'تێپەرەوشەکان لەیەک ناکەن یاخود هەردووکیان بەتاڵن',
					),
				);
			})
			.withMessage('تێپەرەوشەکان لەیەک ناکەن یاخود هەردووکیان بەتاڵن'),
		validate,
	],
	readSingleUserValidator: [
		param('user_id')
			.exists()
			.isInt()
			.withMessage('value should be valid integer'),
		validate,
	],
};
