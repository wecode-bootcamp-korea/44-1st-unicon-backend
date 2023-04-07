const express = require('express');

const orderController = require('../controllers/orderController');

const router = express.Router();
const { loginRequired } = require('../middlewares/auth');

router.post('/orders', orderController.createOrders);
router.post('/orderitems', orderController.createOrderItem);
router.post('', loginRequired, orderController.createOrders);
router.post('', loginRequired, orderController.createOrderItem);

module.exports = {
  router,
};
