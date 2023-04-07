const appDataSource = require('./appDataSource');

const createOrders = async (userId, orderNumber, totalAmount) => {
  try {
    await appDataSource.query(
      `INSERT INTO orders(
		      users_id,
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

const createOrderItem = async (userId, orderId, productId, quantity) => {
  try {
    await appDataSource.query(
      `INSERT INTO order_item(
        user_id,
        order_id,
        product_id,
        quantity,
        price
        ) VALUES (?, ?, ?, ?);
        `,
      [userId, orderId, productId, quantity]
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
};
