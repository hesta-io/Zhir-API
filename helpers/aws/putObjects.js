const { s3 } = require('./config');

module.exports = (objects = []) => {
	/*
		example of a single object should be something like
		for reguller ocr images the convention is here
		userid/jobid/index.jpg
        {
			index: 0,
			name: f.filename,
			base64: f.getFileEncodeDataURL(),
			type: "application/pdf",
			extension: "jpg",
			path: `/original/`,
        }
    */
	const objectPromises = [];
	// const today = new Date();
	// const year = today.getFullYear();
	// const month = today.toLocaleString('default', { month: 'long' });
	objects.forEach((object) => {
		objectPromises.push(
			new Promise((resolve, reject) => {
				const base64String = object.base64.substr(
					object.base64.indexOf(';base64,') + 8,
					object.length,
				);
				// eslint-disable-next-line new-cap
				const binaryData = new Buffer.from(base64String, 'base64');
				s3.upload(
					{
						Bucket: `${process.env.AWS_BUCKET}/${object.path}`, // process.env.AWS_BUCKET
						Body: binaryData,
						// Key: `${uid.time()}-${object.name}`,
						// Key: `${uuiv4()}`,
						Metadata: {
							name: Buffer.from(`${object.name}`).toString(
								'base64',
							),
							extention: `${object.extention}`,
							index: `${object.index}`,
						},
						Key: `${object.index}.${object.extention}`,
						// ACL: 'public-read', // this should change in the future
						ContentType: object.type,
						CacheControl: 'max-age=31557600',
					},
					(err, data) => (err == null ? resolve(data) : reject(err)),
				);
			}),
		);
	});
	return Promise.all(objectPromises);
};
