const db = require('../../../database/connection');

async function duplicateEmailValidator(email) {
	return db('user')
		.count('id as count')
		.where('email', email)
		.then(([d]) => {
			if (d.count > 0) {
				return Promise.reject(new Error('پۆستی ئەلیکترۆنی بوونی هەیە'));
			}
			return Promise.resolve(true);
		});
}
async function duplicateEmailUserUpdateValidator(email, user) {
	return db('user')
		.count('id as count')
		.where('email', email)
		.andWhere('id', '<>', user.id)
		.then(([d]) => {
			if (d.count > 0) {
				return Promise.reject(
					new Error('پۆستی ئەلئکترۆنی بەکارهاتووە'),
				);
			}
			return Promise.resolve(true);
		});
}
async function duplicatePhoneNumberUserUpdateValidator(phone, user) {
	if (phone === '' || phone == null) {
		return Promise.resolve(true);
	}
	return db('user')
		.count('id as count')
		.where('phone_no', phone)
		.andWhere('id', '<>', user.id)
		.then(([d]) => {
			if (d.count > 0) {
				return Promise.reject(
					new Error(
						'ژمارەی مۆبایل لە هەژمارێکی دیکە بەکارهاتووە تکایە پەیوەندیمان پێوەبکە',
					),
				);
			}
			return Promise.resolve(true);
		});
}
async function emailExisitsValidator(email) {
	return db('user')
		.count('id as count')
		.where('email', email)
		.then(([d]) => {
			if (d.count > 0) {
				return Promise.resolve(true);
			}
			return Promise.reject(new Error('پۆستی ئەلیکترۆنی بوونی نیە'));
		});
}

module.exports = {
	duplicateEmailValidator,
	duplicateEmailUserUpdateValidator,
	duplicatePhoneNumberUserUpdateValidator,
	emailExisitsValidator,
};
