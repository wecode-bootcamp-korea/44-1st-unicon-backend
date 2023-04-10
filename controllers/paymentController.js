const paymentService = require('../services/paymentService.js');
const { catchError } = require('../middlewares/error.js');

const createPayment = catchError(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'NOT_FOUNDED_ORDER' });
  }
  await paymentService.createPayment(orderId);

  return res.status(201).json({ message: 'CONFIRMED_PAYMENT' });
});

module.exports = {
  createPayment,
};
