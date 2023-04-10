const appDataSource = require('./appDataSource');

const { v4 } = require('uuid');

const createOrders = async (userId) => {
  const orderNumber = v4();
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

const findMatchedOrdersByUserId = async (userId) => {
  try {
    const [result] = await appDataSource.query(
      `SELECT *
      FROM orders 
      WHERE orders.user_id =? `,
      [userId]
    );
    return result;
  } catch (err) {
    throw new Error(
      `Failed to find matched orders for userId ${userId}: ${err.message}`
    );
  }
};

const createOrderItems = async (userId) => {
  try {
    const cartItems = await appDataSource.query(
      `
      SELECT cart.user_id, cart.product_id, cart.quantity, product.price 
      FROM cart
      JOIN product ON cart.product_id = product.id
      WHERE cart.user_id = ?
    `,
      [userId]
    ); //row 결과가 하나일 경우 쿼리문은 배열이 아니라 단독 객체로 반환함
    // 항상 배열 형태로 반환
    const cartItemArray = Array.isArray(cartItems) ? cartItems : [cartItems];

    const [orderTable] = await appDataSource.query(
      `SELECT *FROM orders WHERE orders.user_id = ?`,
      [userId]
    );
    const orderId = orderTable['id'];

    for (const cartItem of cartItemArray) {
      const [existingOrderItem] = await appDataSource.query(
        `SELECT * FROM order_item WHERE order_id = ? AND product_id = ?`,
        [orderId, cartItem.product_id]
      );

      if (existingOrderItem) {
        await appDataSource.query(
          `UPDATE order_item SET quantity = ? WHERE id = ?`,
          [cartItem.quantity, existingOrderItem.id]
        );
      } else {
        await appDataSource.query(
          `INSERT INTO order_item (
            user_id,
            order_id,
            product_id,
            quantity,
            price
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            cartItem.user_id,
            orderId,
            cartItem.product_id,
            cartItem.quantity,
            cartItem.price,
          ]
        );
      }
    }

    return orderId;
  } catch (err) {
    throw new Error(
      `Failed to create order items for userId ${userId}: ${err.message}`
    );
  }
};

const updatedOrders = async (orderId) => {
  try {
    const orderItems = await appDataSource.query(
      `SELECT * FROM order_item WHERE order_id = ?`,
      [orderId]
    );

    const orderItemArray = Array.isArray(orderItems)
      ? orderItems
      : [orderItems];

    let totalAmount = 0;

    for (let i = 0; i < orderItemArray.length; i++) {
      totalAmount += orderItemArray[i].price * orderItemArray[i].quantity;
    }

    await appDataSource.query(
      `UPDATE orders SET total_amount = ? WHERE id = ?`,
      [totalAmount, orderId]
    );

    return totalAmount;
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

const getImageUrlByProductId = async (orderId) => {
  const orderItems = await appDataSource.query(
    `SELECT * FROM order_item WHERE order_id = ?`,
    [orderId]
  );

  const orderItemArray = Array.isArray(orderItems) ? orderItems : [orderItems];

  const productIds = orderItemArray.map((orderItem) => orderItem.product_id);

  const imageUrl = await appDataSource.query(
    `SELECT image_url
    FROM product_image
    WHERE id IN (
      SELECT MIN(id)
      FROM product_image
      WHERE product_id IN (?)
      GROUP BY product_id
    )
      
    `,
    [productIds]
  );

  return imageUrl.map((result) => result['image_url']);
};

const getUserInfoByUserId = async (userId) => {
  return await appDataSource.query(
    `SELECT 
    addresses,
    points AS currentPoints
    FROM users
    WHERE id =?`,
    [userId]
  );
};

const executedOrder = async (userId) => {
  try {
    const order = await findMatchedOrdersByUserId(userId);
    console.log(order);
    const totalAmount = await updatedOrders(order.id);

    await appDataSource.query(
      `UPDATE users SET points = points-? WHERE id = ?`,
      [totalAmount, userId]
    );

    await appDataSource.query(`DELETE FROM cart WHERE user_id =?`, [userId]);
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createOrders,
  createOrderItems,
  findMatchedOrdersByUserId,
  updatedOrders,
  getImageUrlByProductId,
  getUserInfoByUserId,
  executedOrder,
};
