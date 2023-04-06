const express = require('express');
const router = express.Router();
const { loginRequired } = require('../middlewares/auth');
const productRouter = require('./productRouter');

const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');

router.use('/users', userRouter.router);
router.use('/products', productRouter.router);
router.use('/orders', orderRouter.router);

router.post('', loginRequired, orderController.Order);
module.exports = router;
