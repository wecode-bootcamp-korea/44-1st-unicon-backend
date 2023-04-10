const express = require('express');
const router = express.Router();

const productRouter = require('./productRouter');
const userRouter = require('./userRouter');

router.use('/users', userRouter);
router.use('/products', productRouter);

module.exports = router;
