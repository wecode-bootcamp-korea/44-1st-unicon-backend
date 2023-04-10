const paymentDao = require('../models/paymentDao');

const createPayment = async (orderNumber) => {
  const IdentifyOrderId = await paymentDao.findOrdersByOrderNumber(orderNumber);

  if (!IdentifyOrderId) {
    const err = new Error('NOT_FOUND_ORDER');
    err.statusCode = 401;
    throw err;
  }

  return paymentDao.createPayment(orderNumber);
};

module.exports = {
  createPayment,
};
