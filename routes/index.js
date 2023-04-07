const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');
const productRouter = require('./productRouter');

router.use('/users', userRouter.router);
router.use('/products', productRouter.router);
router.use('/orders', orderRouter.router);

module.exports = router;
