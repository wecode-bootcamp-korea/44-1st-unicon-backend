const express = require('express');

const reviewRouter = require('./reviewRouter');
const productRouter = require('./productRouter');
const userRouter = require('./userRouter');

const router = express.Router();

router.use('/users', userRouter.router);
router.use('/products', productRouter.router);
router.use('/review', reviewRouter.router);

module.exports = router;
