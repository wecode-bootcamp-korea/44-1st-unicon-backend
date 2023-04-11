const express = require('express');
const router = express.Router();

const reviewRouter = require('./reviewRouter');
const productRouter = require('./productRouter');
const userRouter = require('./userRouter');

router.use('/users', userRouter.router);
router.use('/products', productRouter.router);
router.use('/review', reviewRouter.router);

module.exports = router;
