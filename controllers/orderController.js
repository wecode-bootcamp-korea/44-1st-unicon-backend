const orderService = require('../services/orderService.js');
const { catchError } = require('../middlewares/error.js');

const Order = catchError(async (req, res) => {
  const { user_id, order_number, total_amount } = req.body;

  if (!user_id || !order_number || !total_amount) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }

  await orderService.Order(user_id, order_number, total_amount);
  return res.status(201).json({ message: 'ORDER_SUCCESS' });
});

module.exports = {
  Order,
};
