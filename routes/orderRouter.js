const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { loginRequired } = require('../middlewares/auth');

router.get('', loginRequired, orderController.createOrders);
router.post('/execution', loginRequired, orderController.executedOrder);

module.exports = {
  router,
};
