const appDataSource = require('./appDataSource');
const createOrders = async (userId, orderNumber, totalAmount) => {
  try {
    await appDataSource.query(
      `INSERT INTO orders(
          user_id,
          order_number,
          total_amount
          ) VALUES ( ?, ?, ? );
      `,
      [userId, orderNumber, totalAmount]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};
const createOrderItem = async (userId, orderId, productId, quantity, price) => {
  try {
    await appDataSource.query(
      `INSERT INTO order_item(
        user_id,
        order_id,
        product_id,
        quantity,
        price
        ) VALUES (?, ?, ?, ?, ?);
        `,
      [userId, orderId, productId, quantity, price]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};
const createOrderStatus = async (status, orderId) => {
  try {
    await appDataSource.query(
      `INSERT INTO order_item_status(
        status,
        order_id
      ) VALUES(?, ?);
      `,
      [status, orderId]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};
const createOrderItemStatus = async (status, orderItemId) => {
  try {
    await appDataSource.query(
      `INSERT INTO order_item_status(
        status,
        order_item_id
      ) VALUES(?, ?);
      `,
      [status, orderItemId]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};
module.exports = {
  createOrders,
  createOrderItem,
  createOrderStatus,
  createOrderItemStatus,
};
