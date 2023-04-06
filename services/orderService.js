const orderDao = require('../models/orderDao');

const createOrder = async (user_id, order_number, total_amount) => {
  return orderDao.createOrder(user_id, order_number, total_amount);
};

module.exports = {
  createOrder,
};
