const appDataSource = require('./appDataSource');

const { v4 } = require('uuid');

const createOrders = async (userId) => {
  const orderNumber = v4();
  console.log(orderNumber);
  try {
    await appDataSource.query(
      `INSERT INTO orders(
          user_id,
          order_number
          ) VALUES ( ?, ?);
      `,
      [userId, orderNumber]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

const findMatched = async (userId) => {
  try {
    const [result] = await appDataSource.query(
      `SELECT 
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', cart.id,
               'user_id', cart.user_id,
               'order_id', orders.id,
               'product_id', cart.product_id,
               'price', product.price,
               'quantity', cart.quantity
             )
           ) as order_item
         FROM cart
         JOIN product ON cart.product_id = product.id
         JOIN orders ON cart.user_id = orders.user_id
         WHERE cart.user_id = ?`,
      [userId]
    );
    if (!result) {
      throw new Error(`No cart data found for userId ${userId}`);
    }
    const orderItems = JSON.parse(result.order_item);
    return orderItems;
  } catch (err) {
    throw new Error(
      `Failed to find cart data for userId ${userId}: ${err.message}`
    );
  }
};

const findMatchedOrdersByUserId = async (userId) => {
  return await appDataSource.query(
    `SELECT *
    FROM orders 
    WHERE orders.user_id =?  `,
    [userId]
  );
};

const createOrderItem = async (userId) => {
  try {
    const cartItems = await findMatched(userId);
    const orderItems = cartItems.map((cartItem) => {
      return {
        userId: cartItem.user_id,
        orderId: cartItem.order_id,
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        price: cartItem.price,
      };
    });

    for (let i = 0; i < orderItems.length; i++) {
      const orderItem = orderItems[i];
      await appDataSource.query(
        `INSERT INTO order_item(
              user_id,
              order_id,
              product_id,
              quantity,
              price
              ) VALUES (?, ?, ?, ?, ?);
              `,
        [
          orderItem.userId,
          orderItem.orderId,
          orderItem.productId,
          orderItem.quantity,
          orderItem.price,
        ]
      );
    }
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

const updatedOrders = async (userId) => {
  try {
    const orders = await appDataSource.query(
      `SELECT * FROM orders WHERE user_id = ?`,
      [userId]
    );

    for (const order of orders) {
      const orderItems = await appDataSource.query(
        `SELECT * FROM order_item WHERE order_id = ?`,
        [order.id]
      );

      let totalAmount = 0;

      for (let i = 0; i < orderItems.length; i++) {
        totalAmount += orderItems[i].price * orderItems[i].quantity;
      }

      await appDataSource.query(
        `UPDATE orders SET total_amount = ? WHERE id = ?`,
        [totalAmount, order.id]
      );
    }
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
  findMatched,
  findMatchedOrdersByUserId,
  updatedOrders,
};
