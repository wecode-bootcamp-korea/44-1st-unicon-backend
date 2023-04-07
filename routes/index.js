const express = require('express');
const router = express.Router();

const cartRouter = require('./cartRouter');
const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');

router.use('/users', userRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);

module.exports = router;
