const express = require('express');
const pipeS3ObjectToExpress = require('../helpers/aws/pipeS3ObjectToExpress');

const router = express.Router();

router.get('*', (req, res) => {
	const rawKey = `${req.url}`.substring(1);
	const key = rawKey.split('?')[0];
	const splitedKey = key.split('/');
	const userId = splitedKey[1] || -1;

	if (userId === req.user.id || req.user.is_admin) {
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: key,
		};
		pipeS3ObjectToExpress(params, res);
	} else if (userId > -1) {
		res.json({ msg: 'مافی گەشتن بەم فایلەت نیە' });
	} else {
		res.json({ msg: 'فایلی داواکراو بوونی نیە یان نەدۆزرایەوە.' });
	}
});
module.exports = router;
