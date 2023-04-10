const paymentService = require('../services/paymentService.js');
const { catchError } = require('../middlewares/error.js');

const createPayment = catchError(async (req, res) => {
  const { orderNumber } = req.body;

  if (!orderNumber) {
    return res.status(400).json({ message: 'NOT_FOUNDED_ORDER' });
  }
  await paymentService.createPayment(orderNumber);

  return res.status(201).json({ message: 'CONFIRMED_PAYMENT' });
});

const executedPayment = catchError(async (req, res) => {
  const { orderNumber } = req.body;

  if (!orderNumber) {
    return res.status(400).json({ message: 'NOT_FOUNDED_' });
  }
  await paymentService.createPayment(orderNumber);

  return res.status(201).json({ message: 'CONFIRMED_PAYMENT' });
});

module.exports = {
  createPayment,
  executedPayment,
};
