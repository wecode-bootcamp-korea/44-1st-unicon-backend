const express = require('express');
const router = express.Router();

const cartRouter = require('./cartRouter');
const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');
const productRouter = require('./productRouter');

const paymentRouter = require('./paymentRouter');

router.use('/users', userRouter.router);
router.use('/products', productRouter.router);
router.use('/orders', orderRouter.router);
router.use('/payment', paymentRouter.router);
router.use('/cart', cartRouter);

module.exports = router;
