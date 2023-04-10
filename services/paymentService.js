const paymentDao = require('../models/paymentDao');

const createPayment = async (orderId) => {
  try {
    const IdentifyOrderId = await paymentDao.findOrdersByOrderId(orderId);

    if (IdentifyOrderId === undefined || IdentifyOrderId === null) {
      await paymentDao.createPayment(orderId);
    }

    return paymentDao.createPayment(orderId);
  } catch (err) {
    throw new Error('NOT_FOUNDED_ORDER_ID');
  }
};

module.exports = {
  createPayment,
};
