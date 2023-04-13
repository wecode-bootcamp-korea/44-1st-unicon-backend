const paymentDao = require('../models/paymentDao');

const createPayment = async (orderNumber) => {
  const payment = await paymentDao.createPayment(orderNumber);
  const orderInfoArray = Array.isArray(payment) ? payment : [payment];
  const totalAmount = orderInfoArray[0];
  const point = orderInfoArray[1];
  const Points = Array.isArray(point) ? point : [point];
  const updatePoint = Points[0];
  const Name = orderInfoArray[2];
  const Names = Array.isArray(Name) ? Name : [Name];
  const names = Names[0];

  return {
    totalAmount: totalAmount,
    updatePoint: updatePoint,
    productName: names,
  };
};

module.exports = {
  createPayment,
};
