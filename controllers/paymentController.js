const paymentService = require('../services/paymentService.js');
const { catchError } = require('../middlewares/error.js');

const createPayment = catchError(async (req, res) => {
  const { orderNumber } = req.body;
  
  const payment = await paymentService.createPayment(orderNumber);
  return res.status(201).json(payment);
});

module.exports = {
  createPayment,
};
