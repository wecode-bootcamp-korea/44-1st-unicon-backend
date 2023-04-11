const express = require('express');
const router = express.Router();
const { loginRequired } = require('../middlewares/auth');

const productRouter = require('./productRouter');
const userRouter = require('./userRouter');
const cartRouter = require('./cartRouter');
const paymentRouter = requrie('./paymentRouter');

router.use('/users', userRouter.router);
router.use('/products', productRouter.router);
router.use('/cart', cartRouter);
router.use('/payment', paymentRouter.router);

module.exports = router;
