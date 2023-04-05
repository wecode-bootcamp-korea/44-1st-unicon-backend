const express = require("express");
const router = express.Router();

const cartRouter = require("./cartRouter")
const orderRouter = require("./orderRouter")

router.use("/cart", cartRouter)
router.use("/order", orderRouter)

module.exports = router;
