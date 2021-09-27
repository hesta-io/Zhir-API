const express = require('express');
const withUserAuth = require('../controller/withUserAuth');
const authRouter = require('./auth');
const jobRouter = require('./job');
const s3interface = require('./s3interface');
const userRouter = require('./user');
const idPayRouter = require('./idPay');

const router = express();
router.use('/api/auth', authRouter);
router.use('/api/job', jobRouter);
router.use('/api/user', withUserAuth(userRouter));
router.use('/api/payment/idpay', idPayRouter);
router.use('/assets', withUserAuth(s3interface));

module.exports = router;
