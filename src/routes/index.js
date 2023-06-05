const express = require('express');

const reviewRouter = require('./reviewRouter');
const productRouter = require('./productRouter');
const userRouter = require('./userRouter');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');
const paymentRouter = require('./paymentRouter');
const router = express.Router();

router.use('/users', userRouter.router);
router.use('/products', productRouter.router);
router.use('/review', reviewRouter.router);
router.use('/cart', cartRouter.router);
router.use('/order', orderRouter.router);
router.use('/payment', paymentRouter.router);
module.exports = router;
