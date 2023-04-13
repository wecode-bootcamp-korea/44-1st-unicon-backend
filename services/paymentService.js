const paymentDao = require('../models/paymentDao');

const createPayment = async (orderNumber) => {
  const payment = paymentDao.createPayment(orderNumber);
  const orderInfoArray = Array.isArray(payment) ? payment : [payment];
  const totalAmount = orderInfoArray[0];
  const [{ updatePoint }] = orderInfoArray[1];
  const getProductName = orderInfoArray[2];
  let names = [];
  getProductName.forEach((i) => names.push(i.names));
  return [
    {
      totalAmount: totalAmount,
      updatePoint: updatePoint,
      productName: names,
    },
  ];
};

module.exports = {
  createPayment,
};
