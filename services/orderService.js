const orderDao = require('../models/orderDao');

const createOrders = async (userId) => {
  const existingOrders = await orderDao.findMatchedOrdersByUserId(userId) || [];

  if (existingOrders.length === 0) {
    await orderDao.createOrders(userId); 
  }

  const cartItems = await orderDao.findMatched(userId); 
  console.log("cartItems:" + cartItems)
  if (cartItems.length > 0) {
    await orderDao.createOrderItem(cartItems); 
  }

  await orderDao.updatedOrders(userId); 
  return 'orderCreated';
};

// const createOrderStatus = async (status, orderId) => {

//   return await orderDao.createOrderStatus(status, orderId);
// };

// const createOrderItemStatus = async (status, orderItemId) => {

//   return await orderDao.createOrderItemstatus(status, orderItemId);
// };
module.exports = {
  createOrders,
  //   createOrderStatus,
  //   createOrderItemStatus,
};
