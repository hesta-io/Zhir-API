const AWS = require('aws-sdk');

AWS.config.update({
	endpoint: process.env.AWS_ENDPOINT,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

module.exports = {
	AWS,
	s3,
};
