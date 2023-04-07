const express = require('express');
const router = express.Router();

const cartRouter = require('./cartRouter');

const userRouter = require('./userRouter');

router.use('/users', userRouter.router);
router.use('/cart', cartRouter);

module.exports = router;
