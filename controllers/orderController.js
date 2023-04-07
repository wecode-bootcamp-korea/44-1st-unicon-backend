const orderService = require('../services/orderService.js');
const { catchError } = require('../middlewares/error.js');


const createOrders = catchError(async (req, res) => {

  const userId= req.user.id  

  const {orderNumber, totalAmount } = req.body;
  if (!userId || !orderNumber || !totalAmount) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }
 
  await orderService.createOrders({userId, orderNumber, totalAmount});
  return res.status(201).json({ message: 'ORDER_SUCCESS' });
});


const createOrderStatus = catchError(async (req, res) => {
  const { status, orderId } = req.body;
  if (!status || !orderId) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }
  await orderService.createOrderStatus(status, orderId);
  return res.status(201).json({ message: 'CHECKED_ORDER_STATUS' });
});


const createOrderItemStatus = catchError(async (req, res) => {
  const { status, orderItemId } = req.body;
  if (!status || !orderItemId) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }
  await orderSerivce.createOrderItemStatus(status, orderItemId);
  return res.status(201).json({ message: 'CHECKED_ITEM_STATUS' });
});


module.exports = {
  createOrders,
  createOrderItem,
  createOrderStatus,
  createOrderItemStatus,
};