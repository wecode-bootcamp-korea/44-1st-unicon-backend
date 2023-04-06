const express = require('express');

const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/order', orderController.Order);

module.exports = {
  router,
};
