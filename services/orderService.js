const orderDao = require('../models/orderDao');
const uuid = require('uuid');

// const { v4 } = require('uuid');

// const uuid = () => {
//   const tokens = v4().split('-');
//   return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
// };

// uuid();

const createOrders = async (userId, orderNumber, totalAmount) => {
  const uuIdorderNumber = await uuid;
  return await orderDao.createOrders(userId, orderNumber, totalAmount);
};

const createOrderItem = async (userId, orderId, productId, quantity) => {
  return await orderDao.createOrderItem(userId, orderId, productId, quantity);
};

const createOrderStatus = async (status, orderId) => {
  return await orderDao.createOrderStatus(status, orderId);
};

const createOrderItemStatus = async (status, orderItemId) => {
  return await orderDao.createOrderItemstatus(status, orderItemId);
};

module.exports = {
  createOrders,
  createOrderItem,
  createOrderStatus,
  createOrderItemStatus,
};
