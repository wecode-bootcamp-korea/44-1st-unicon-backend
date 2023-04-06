const express = require('express');
const router = express.Router();
const { loginRequired } = require('../middlewares/auth');

const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');

router.use('/users', userRouter.router);
router.use('/orders', orderRouter.router);

module.exports = router;
