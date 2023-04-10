const appDataSource = require('./appDataSource');
const { v4 } = require('uuid');

const createPayment = async (orderId) => {
  const orderNumber = v4();
  try {
    await appDataSource.query(
      `INSERT INTO payment (
         order_id,
         order_num,
         user_id,
         total_price
      ) VALUES (?, ?, ?, ?);
      `,
      [orderId, orderNumber, userId, totalPrice]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    err.statusCode = 500;
    throw error;
  }
};

const findOrdersByOrderId = async (orderId) => {
  try {
    const [payment] = await appDataSource.query(
      `SELECT 
         orders.id as orderId,
         orders.user_id  AS UserId,
         orders.order_number AS orderNumber,
         orders.total_amount AS totalPrice
      FROM
        orders
      ON
        orders.id = payment.order_id
      WHERE
        orders.id = ?
      `,
      [orderId, UserId, orderNumber, totalPrice]
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
  findOrdersByOrderId,
};
