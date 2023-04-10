const appDataSource = require('./appDataSource');
const { v4 } = require('uuid');

const createPayment = async (orderNumber) => {
  const orderNumber = v4();
  try {
    await appDataSource.query(
      `INSERT INTO payment (
         order_id,
         order_num,
         user_id,
         total_amount
      ) VALUES (?, ?, ?, ?);
      `,
      [orderId, orderNumber, userId, totalAmount]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    err.statusCode = 500;
    throw error;
  }
};

const findOrdersByOrderNumber = async (orderNumber) => {
  try {
    const [payment] = await appDataSource.query(
      `SELECT 
         orders.id as orderId,
         orders.order_number AS orderNumber,
         orders.user_id  AS UserId,
         orders.total_amount AS totalAmount
      FROM
        orders
      ON
        orders.order_number = receipt.order_number
      WHERE
        orders.order_number= ?
      `,
      [orderId, orderNumber, UserId, totalAmount]
    );
    return payment;
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createPayment,
  findOrdersByOrderNumber,
};
