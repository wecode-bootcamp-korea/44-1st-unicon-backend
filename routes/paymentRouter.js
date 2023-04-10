const express = require('express');
const paymentController = require('../controllers/paymentController');
const { loginRequired } = require('../middlewares/auth');
const router = express.Router();

router.post('', loginRequired, paymentController.createPayment);
router.get('/payment', paymentController.executedPayment);

module.exports = {
  router,
};
