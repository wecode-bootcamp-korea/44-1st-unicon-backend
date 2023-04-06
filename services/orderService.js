const orderDao = require('../models/orderDao');

const Order = async (user_id, order_number, total_amount) => {
  return orderDao.Order(user_id, order_number, total_amount);
};

module.exports = {
  Order,
};
