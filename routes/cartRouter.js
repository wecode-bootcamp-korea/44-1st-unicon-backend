const express = require("express");
const cartController = require("../controllers/cartController");
const { authorize } = require("../middlewares/authorize");
const router = express.Router();

router.post("", authorize,cartController.createCartItem);
router.get("", authorize,cartController.getCartList);
router.put("/:productId",authorize,cartController.updateCart);
router.delete("/:productId",authorize,cartController.deleteCart);

module.exports = router;

