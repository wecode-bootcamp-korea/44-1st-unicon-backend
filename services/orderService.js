const userDao = require('../models/orderDao');
const bcrypt = require('bcrypt');

const Order = async (user_name) => {
  const user_id = await OrderDao.getUserId(user_id);

  if (!user_id) {
    const err = new Error('NOT_FOUND_USER');
    err.statusCode = 404;
    throw err;
  }
};

module.exports = {
  Order,
};
