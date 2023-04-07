const express = require('express');
const router = express.Router();

const cartRouter = require("./cartRouter")
//const orderRouter = require("./orderRouter")


// router.use("/order", orderRouter)
const { loginRequired } = require('../middlewares/auth');
//const productRouter = require('./productRouter');

const userRouter = require('./userRouter');

router.use('/users', userRouter.router);
//router.use('/products', productRouter.router);
router.use("/cart", cartRouter)


module.exports = router;
