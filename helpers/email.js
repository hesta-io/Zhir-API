const nodemailer = require('nodemailer');

async function send(
	subject,
	text,
	to = process.env.MAILING_LIST,
	cb = () => {},
) {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.SENDER_EMAIL,
				pass: process.env.SENDER_PASSWORD,
			},
		});
		const message = {
			from: `<${process.env.SENDER_EMAIL}>`,
			to,
			subject,
			text: subject,
			html: text,
		};
		transporter.sendMail(message, (err, info) => {
			cb(err, info);
		});
	} catch (e) {
		// handle errors here
	}
}

module.exports = {
	send,
};
