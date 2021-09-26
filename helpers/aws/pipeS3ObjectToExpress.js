const { s3 } = require('./config');

module.exports = (params, res) => {
	s3.headObject(params, (err, headers) => {
		if (err) {
			res.status(404).json({
				msg: 'ئەنجامی داواکراو بوونی نیە یان نەدۆزرایەوە',
			});
		} else {
			const stream = s3.getObject(params).createReadStream();

			stream.on('error', () => {
				res.status(404).json({
					msg: 'هەڵەیەک رویدا لەکاتی ناردنەوەی ئەنجام',
				});
			});
			res.set('Content-Type', headers.ContentType);
			res.set('Content-Length', headers.ContentLength);
			res.set('Last-Modified', headers.LastModified);
			res.set('ETag', headers.ETag);
			// Pipe the s3 object to the response
			stream.pipe(res);
		}
	});
};
