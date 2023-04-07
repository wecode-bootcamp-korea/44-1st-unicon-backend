const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { loginRequired } = require('../middlewares/auth');

router.post('', loginRequired, orderController.createOrders);

router.post('', loginRequired, orderController.createOrderStatus);
router.post('', loginRequired, orderController.createOrderItemStatus);
module.exports = {
  router,
};