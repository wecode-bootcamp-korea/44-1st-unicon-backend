const express = require('express');
const paymentController = require('../controllers/paymentController');
const { loginRequired } = require('../middlewares/auth');
const router = express.Router();

const transaction = await sequelize.transaction();

router.post('', loginRequired, paymentController.createPayment);
module.exports = {
  router,
};
