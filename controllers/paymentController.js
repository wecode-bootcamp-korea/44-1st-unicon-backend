const paymentService = require('../services/paymentService.js');
const { catchError } = require('../middlewares/error.js');

const createPayment = catchError(async (req, res) => {
  const { orderNumber } = req.body;
  console.log(orderNumber);
  // const userId = req.user_id;
  await paymentService.createPayment(orderNumber);
  return res.status(201).json({ message: 'PAYMENT_SUCCESS' });
});

module.exports = {
  createPayment,
};
