const orderDao = require('../models/orderDao');

const createOrders = async (userId, orderNumber, totalAmount) => {
  return await orderDao.createOrders(userId, orderNumber, totalAmount);
};

const createOrderItem = async (userId, orderId, productId, quantity) => {
  return await orderDao.createOrderItem(userId, orderId, productId, quantity);
};

module.exports = {
  createOrders,
  createOrderItem,
};
