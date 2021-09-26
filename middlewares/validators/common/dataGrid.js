const { query } = require('express-validator');
const validate = require('../validate');

module.exports = [
	query('pageSize')
		.customSanitizer((value) => ((value) || 10))
		.isInt({ gt: 0 })
		.withMessage('input should be a valid integer'),
	query('page')
		.customSanitizer((value) => ((value) || 0))
		.isInt({ gt: -1 }).withMessage('input should be a valid integer'),
	query('sorted')
		.customSanitizer((value) => ((value) || []))
		.isArray()
		.withMessage('input must be an array')
		.custom((value) => {
			if (value.length > 5) { return Promise.reject(new Error('array must contain less than 5 items ')); }
			return Promise.resolve(true);
		}),
	query('sorted.*')
		.isString()
		.matches(/^([a-zA-Z0-9._ . _])+:([a-zA-Z0-9 % \- ء-ي قوەرتیئحۆپڕاسدفگهژکلزخجڤبێنمضچى . _ - ـ = + * & $ %])+$/i)
		.withMessage('invalid format should be columnName:value')
		.customSanitizer((value) => {
			const splitedValue = value.split(':');
			return {
				column: splitedValue[0],
				value: splitedValue[1],
			};
		}),
	query('sorted.*.column')
		.exists(),
	query('sorted.*.value')
		.isIn(['asc', 'desc'])
		.withMessage('allowed values for sorted column value is `asc` or `desc`'),
	query('filtered')
		.customSanitizer((value) => ((value) || []))
		.isArray()
		.withMessage('input must be an array')
		.custom((value) => {
			if (value.length > 11) { return Promise.reject(new Error('array must contain less than 10 items ')); }
			return Promise.resolve(true);
		}),
	query('filtered.*')
		.isString()
	// eslint-disable-next-line no-useless-escape
		.matches(/^([a-zA-Z0-9._])+:([a-zA-Z0-9 % \- ء-ي قوەرتیئحۆپڕاسدفگهژکلزخجڤبێنمضچى . - ـ = + * & $ %])+$/i)
		.withMessage('invalid format should be columnName:value')
		.customSanitizer((value) => {
			const splitedValue = value.split(':');
			return {
				column: splitedValue[0],
				value: splitedValue[1],
			};
		}),
	query('filtered.*.column')
		.matches(/^([a-zA-Z0-9. _ـ - #])+$/i)
		.withMessage('column name is not alphanumeric'),
	query('filtered.*.value')
		.escape(),
	validate,
];
