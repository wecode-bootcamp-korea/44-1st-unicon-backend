const express = require("express");

const cartController = require("../controllers/cartController");
const { loginRequired } = require("../middlewares/auth");
const router = express.Router();

router.post("", loginRequired,cartController.createCartItem);
router.get("", loginRequired,cartController.getCartList);
router.put("", loginRequired,cartController.updateCart);
router.delete("/:productId", loginRequired,cartController.deleteCart);

module.exports = router;

