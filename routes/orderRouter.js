const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { loginRequired } = require('../middlewares/auth');

router.get('', loginRequired, orderController.createOrders);
router.get('/purchaseditems', loginRequired, orderController.purchaseditems);
module.exports = { router };
