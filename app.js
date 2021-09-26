const express = require('express');
const debug = require('debug');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rfs = require('rotating-file-stream');
const path = require('path');
require('dotenv').config();

const app = express();
const accessLogStream = rfs.createStream('access.log', {
	size: '10M', // rotate every 10 MegaBytes written
	interval: '1d', // rotate daily
	path: path.join(__dirname, 'log'),
});

const logger = morgan('combined', {
	stream: accessLogStream,
});
app.use(logger);

app.use(cors());
// app.use(helmet({
// contentSecurityPolicy: false,
// }));
app.use(helmet());
app.use(compression());

app.use(express.json({ limit: '20mb' }));
app.set('view engine', 'ejs');

const seInterfaceRouter = require('./routes/s3interface');

app.use('/files', seInterfaceRouter);

app.use('/', require('./routes'));

app.get('/', (req, res) => {
	res.json({ msg: 'Akeed Express' });
});
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	debug.error(err.stack);
	res.status(500).send(err.toString());
});

module.exports = app;
