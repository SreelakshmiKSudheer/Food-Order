const express = require('express');
const router = express.Router();

const authRouter = require('./authRouter');
const buyerRouter = require('./buyerRouter');
const sellerRouter = require('./sellerRouter');
const userRouter = require('./userRouter');
// const adminRouter = require('./adminRouter');

router.use('/auth', authRouter);
router.use('/buyer', buyerRouter);
router.use('/seller', sellerRouter);
router.use('/user', userRouter);
module.exports = router;
