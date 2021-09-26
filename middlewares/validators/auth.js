const { body, query } = require('express-validator');
const validate = require('./validate');
const { emailExisitsValidator } = require('./data/user');
const blockedEmails = require('./blockedMailProviders');

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
	emailPassValidator: [
		body('email')
			.exists()
			.withMessage('key does not exist')
			.trim()
			.custom((v) => blockedEmailValidator(v, blockedEmails)),
		body('password').exists().withMessage('key does not exist'),
		validate,
	],
	passwordResetValidator: [
		body('token')
			.exists()
			.isHash('sha1')
			.withMessage('تۆکنی گۆرینی تێپەرەوشە هەڵەیە'),
		body('password_retype').optional().isString(),
		body('password')
			.optional()
			.isString()

			.withMessage('input is not valid string')
			.isLength({ min: 3 })
			.withMessage(' minimum length for user password is 2 chars')
			.custom((value, { req }) => {
				if (value === req.body.password_retype && value !== '') {
					return Promise.resolve('success');
				}
				return Promise.reject(
					new Error(
						'user passwords dont match or both fields are empty',
					),
				);
			})
			.withMessage('passwords dont match or bothe fields are empty'),
		validate,
	],
	activateAccountValidator: [
		query('token')
			.exists()
			.isHash('sha1')
			.withMessage('تۆکنی کاراکردنی هەژمار هەڵەیە'),
		validate,
	],
	phoneNoValidator: [
		body('phone_no')
			.exists()
			.matches(/^964[0-9][1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/i)
			.withMessage(
				'phone number should be an iraqi phone and in this format 964 *** *******',
			),
		validate,
	],
	phoneNoWithCodeValidator: [
		body('phone_no')
			.exists()
			.matches(/^964[0-9][1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/i)
			.withMessage(
				'phone number should be an iraqi phone and in this format 964 *** *******',
			),
		body('code')
			.exists()
			.isInt({ min: 6 })
			.withMessage('invalid verification code'),
		validate,
	],
	requestPasswordResetValidator: [
		body('email')
			.exists()
			.withMessage('بوونی نیە')
			.trim()
			.isString()
			.withMessage('input is not a valid string')
			.custom((v) => emailExisitsValidator(v))
			.custom((v) => blockedEmailValidator(v, blockedEmails)),
		validate,
	],
};
