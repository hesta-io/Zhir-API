const jwtVerify = require('../middlewares/jwt/user');
const defaultController = require('./default');

module.exports = (query, validators = []) => {
	const validationArray = [jwtVerify];
	if (validators.length > 0) {
		validators.forEach((validator) => {
			validationArray.push(validator);
		});
	}
	validationArray.push(defaultController(query));
	return validationArray;
};
