const orderService = require('../services/orderService.js');
const { catchError } = require('../middlewares/error.js');

const createOrders = catchError(async (req, res) => {
  const { orderNumber, totalAmount } = req.body;

  if (!orderNumber || !totalAmount) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }

  await orderService.createOrders(orderNumber, totalAmount);
  return res.status(201).json({ message: 'ORDER_SUCCESS' });
});

const createOrderItem = catchError(async (req, res) => {
  await orderService.createOrderItems();
  return res.status(201).json({ message: 'CONFIRMED_ORDER_ITEMS' });
});

module.exports = {
  createOrders,
  createOrderItem,
};
