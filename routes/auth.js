const express = require('express');
const jwt = require('jsonwebtoken');

const { v4: uuidv4 } = require('uuid');
const sha1 = require('sha1');
const utc = require('dayjs/plugin/utc');
const dayjs = require('dayjs');
const { createValidator } = require('../middlewares/validators/user');
const {
	passwordResetValidator,
	requestPasswordResetValidator,
	emailPassValidator,
	activateAccountValidator,
} = require('../middlewares/validators/auth');
const {
	passwordResetTemplate,
	activateAccountTemplate,
} = require('../helpers/emailTemplates');
const { send } = require('../helpers/email');

const db = require('../database/connection');

dayjs.extend(utc);

const router = express();

function register(data) {
	const salt = uuidv4();
	const user = {
		name: data.name,
		company_name: data.company_name,
		email: data.email,
		password: sha1(`${salt}${data.password}`),
		salt,
		active: 1,
		verified: 0,
		gender: 'unspecified',
		created_at: db.fn.now(),
		updated_at: db.fn.now(),
	};
	return db('user').insert(user);
}
function login(email, password) {
	return db.transaction(async (trx) => {
		const [checkEmail] = await trx('user')
			.select()
			.where('email', email)
			.andWhere('active', 1)
			.andWhere('deleted', 0)
			.limit(1);

		if (checkEmail && checkEmail.verified === 0) {
			return {
				status: 400,
				success: false,
				msg:
					'هەژمارەکەت کارا نیە تکایە سەیری ئیمێڵەکەت بکە بۆ وەرگرتنی بەستەری کاراکردن یان پەیوەندیمان پێوەبکە.',
				user: null,
			};
		}

		if (!checkEmail || !checkEmail.id) {
			return {
				status: 400,
				success: false,
				msg: ' پۆستی ئەلئکترۆنی نەدۆزرایەوە یان هەژمارەکەت راگیراوە',
				user: null,
			};
		}

		const [checkPassword] = await trx('user')
			.select('user.*')
			.where('user.id', checkEmail.id)
			.andWhere('password', sha1(checkEmail.salt + password))
			.limit(1);
		if (!checkPassword || !checkPassword.id) {
			return {
				status: 400,
				success: false,
				msg: 'تێپەڕەوشە هەڵەیە',
				user: null,
			};
		}
		delete checkPassword.salt;
		delete checkPassword.password;
		delete checkPassword.tmp_password;
		const token = jwt.sign({ data: checkPassword }, process.env.USER_JWT_SECRET, { expiresIn: '362d' });

		return {
			status: 200,
			success: true,
			msg: 'سەرکەوتووبوو',
			user: checkPassword,
			token,
		};
	});
}
function generateTmpPass(email) {
	return db('user')
		.select()
		.where('email', email)
		.where('active', 1)
		.where('verified', 1)
		.limit(1)
		.then(([user]) => {
			if (user) {
				const mutatedUser = user;
				// we will not validate this after 5 mins you must request another one
				const tmpPass = sha1(uuidv4());
				return db('user')
					.update({ tmp_password: tmpPass })
					.where('id', mutatedUser.id)
					.then(() => {
						mutatedUser.tmp_password = tmpPass;
						return Promise.resolve(mutatedUser);
					});
			}
			return Promise.reject(new Error('بەکارهێنەر نەدۆزرایەوە'));
		});
}

function passwordReset(data) {
	return db('user')
		.select()
		.where('tmp_password', data.token)
		.andWhere('tmp_password', '<>', '')
		.limit(1)
		.then(([user]) => {
			if (user) {
				const salt = uuidv4();
				const updateObject = {
					password: sha1(`${salt}${data.password}`),
					salt,
					tmp_password: '',
				};
				return db('user')
					.update(updateObject)
					.where('id', user.id)
					.then(() => Promise.resolve(user));
			}
			return Promise.reject(
				new Error('ئەم بەستەرە بەسەرچووە ناتواندرێت بەکاربهێندرێت'),
			);
		});
}

function generateActivationToken(email) {
	return db('user')
		.select()
		.where('email', email)
		.limit(1)
		.then(([user]) => {
			if (user) {
				const activationToken = sha1(uuidv4());
				const mutatedUser = user;
				return Promise.all([
					db('user')
						.update({ activation_token: activationToken })
						.where('id', user.id)
						.then(() => {
							mutatedUser.activation_token = activationToken;
							return Promise.resolve(mutatedUser);
						}),
					db('activation_token').insert({
						token: activationToken,
						user_id: mutatedUser.id,
						created_at: dayjs.utc().format('YYYY-MM-D H:m:s'),
					}),
				]).then((values) => values[0]);
			}
			return Promise.reject(new Error('بەکارهێنەر نەدۆزرایەوە'));
		});
}
function activateAccount(data) {
	return db('user')
		.select()
		.where('activation_token', data.token)
		.andWhere('activation_token', '<>', '')
		.limit(1)
		.then(([user]) => {
			if (user) {
				const updateObject = {
					verified: 1,
					activation_token: '',
				};
				return db('user')
					.update(updateObject)
					.where('id', user.id)
					.then(async () => {
						await db('user_transaction').insert({
							user_id: user.id,
							type_id: 1, // for recharge
							payment_medium_id: 1, // for zhir.io
							page_count: 50,
							confirmed: 1,
							amount: 0,
							transaction_id: uuidv4(),
							user_note:
								'دیاری دروستکردنی هەژمار هەموو مانگێک خۆکارانە ٥٠ لاپەڕە وەردەگریت',
							admin_note: 'Account Activation Present',
							created_at: db.fn.now(),
						});
						return Promise.resolve(user);
					});
			}
			return db('activation_token')
				.select()
				.where('token', data.token)
				.limit(1)
				.then(([userToken]) => {
					if (userToken) {
						return Promise.resolve(userToken);
					}
					return Promise.reject(
						new Error(
							'ئەم بەستەرە بەسەرچووە ناتواندرێت بەکاربهێندرێت',
						),
					);
				});
		});
}

router.post('/login', emailPassValidator, (req, res) => {
	const { email, password } = req.body;
	login(email, password)
		.then((r) => {
			if (r.success) {
				res.json(r.user);
			} else {
				res.status(r.status).json({ msg: r.msg });
			}
		})
		.catch(() => {
			res.status(401).json({
				msg: 'هەڵەیەک ڕوویدا لەکاتی چوونەژوورەوە',
			});
		});
});
router.post('/register', createValidator, (req, res) => {
	const { body } = req;
	register(body)
		.then(async () => {
			generateActivationToken(body.email)
				.then((user) => {
					const activationToken = user.activation_token;
					const url = `${process.env.DOMAIN}/api/auth/activate-account?token=${activationToken}`;
					const htmlMsg = activateAccountTemplate(url);
					send('ژیر | کاراکردنی هەژمار', htmlMsg, user.email, () => {
						res.json({ msg: 'هەژمار دروستکرا' });
					});
				})
				.catch((e) => {
					console.log(e);
					res.status(500).json({
						msg:
							'ناردنی بەستەری کاراکردنی هەژمار سەرکەوتوو نەبوو تکایە پەیوەندیمان پێوەبکە',
					});
				});
		})
		.catch(() => {
			res.status(500).json({
				msg: 'خۆتۆمارکردن سەرکەوتوو نەبوو',
			});
		});
});
router.post(
	'/request-password-reset',
	requestPasswordResetValidator,
	(req, res) => {
		const { body } = req;
		generateTmpPass(body.email)
			.then((user) => {
				const tmpPass = user.tmp_password;
				const url = `${process.env.DOMAIN}/password-reset?token=${tmpPass}`;
				const htmlMsg = passwordResetTemplate(url);
				send('ژیر | گۆڕینی تێپەڕەوشە', htmlMsg, user.email, () => {
					res.json({ msg: 'yayy' });
				});
			})
			.catch(() => {
				res.status(500).json({
					msg: 'ناردنی تێپەڕەوشە سەرکەوتوونەبوو',
				});
			});
	},
);
router.post('/password-reset', passwordResetValidator, (req, res) => {
	const { body } = req;
	passwordReset(body)
		.then((user) => {
			const mutatedUser = {
				...user,
				salt: undefined,
				password: undefined,
				tmp_password: undefined,
			};
			const token = jwt.sign({ data: mutatedUser }, process.env.USER_JWT_SECRET, { expiresIn: '362d' });
			mutatedUser.token = token;
			res.json({
				user: mutatedUser,
				token,
			});
		})
		.catch((e) => {
			res.status(500).json({
				msg: e.toString(),
			});
		});
});

// this route should be called and generated once per account only in registration
// router.post(
// 	'/request-activation-link',
// 	requestPasswordResetValidator,
// 	(req, res) => {
// 		const { body } = req;
// 		generateActivationToken(body.email)
// 			.then((user) => {
// 				const activationToken = user.activation_token;
// 				const url = `${process.env.DOMAIN}/activate-account?token=${activationToken}`;
// 				const htmlMsg = activateAccountTemplate(url);
// 				send('ژیر | کاراکردنی هەژمار', htmlMsg, user.email, () => {
// 					res.json({ msg: 'yayy' });
// 				});
// 			})
// 			.catch((e) => {
// 				res.status(500).json({
// 					msg: 'ناردنی بەستەری کاراکردنی هەژمار سەرکەوتوو نەبوو تکایە پەیوەندیمان پێوەبکە',
// 				});
// 			});
// 	}
// );

router.get('/activate-account', activateAccountValidator, (req, res) => {
	const { query } = req;
	activateAccount(query)
		.then((user) => {
			if (user.user_id) {
				res.redirect('/login?account-status=already-activated');
			} else {
				res.redirect('/login?account-status=activated');
			}
		})
		.catch((e) => {
			res.status(500).json({
				msg: e.toString(),
			});
		});
});

// router.get('/logout', (req, res) => {
// 	req.session.destroy(() => {
// 		res.redirect('/');
// 	});
// });
module.exports = router;
