const paymentDao = require('../models/paymentDao');

const createPayment = async (orderNumber) => {
  return paymentDao.createPayment(orderNumber);
};

module.exports = {
  createPayment,
};
