const paymentDao = require('../models/paymentDao');

const createPayment = async (orderNumber) => {
  return await paymentDao.createPayment(orderNumber);
};

module.exports = {
  createPayment,
};
