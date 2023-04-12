const appDataSource = require('./appDataSource');
const { DatabaseError } = require('../middlewares/error');
const { orderStatusEnum } = require('../middlewares/enums');
const { v4 } = require('uuid');

const createOrders = async (userId, orderStatus) => {
  const orderNumber = v4();
  try {
    await appDataSource.query(
      `INSERT INTO orders(
          user_id,
          order_number,
          order_status_id
          ) VALUES ( ?, ?, ?);
      `,
      [userId, orderNumber, orderStatus]
    );
  } catch (err) {
    throw new DatabaseError(
      `Failed to find matched orders for userId ${userId}: ${err.message}`
    );
  }
};

const findMatched = async (userId) => {
  try {
    const result = await appDataSource.query(
      `SELECT *
      FROM orders 
      WHERE orders.user_id =?
      ORDER BY orders.id DESC 
      LIMIT 1`,
      [userId]
    );
    const resultArray = Array.isArray(result) ? result : [result];

    return resultArray;
  } catch (err) {
    throw new DatabaseError(
      `Failed to find matched orders for userId ${userId}: ${err.message}`
    );
  }
};

const createOrderAndItems = async (userId, orderId) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();

  try {
    const cartItems = await queryRunner.query(
      `
        SELECT cart.user_id, cart.product_items, cart.quantity, product.price 
        FROM cart
        JOIN product ON cart.product_items = product.id
        WHERE cart.user_id = ?
            `,
      [userId]
    );

    const cartItemArray = Array.isArray(cartItems) ? cartItems : [cartItems];

    for (const cartItem of cartItemArray) {
      const existingOrderItem = await queryRunner.query(
        `SELECT * FROM order_item WHERE order_id = ? AND product_id = ?`,
        [orderId, cartItem.product_items]
      );

      const existingOrderItemArray = Array.isArray(existingOrderItem)
        ? existingOrderItem
        : [existingOrderItem];

      if (existingOrderItemArray.length > 0) {
        existingOrderItemArray.forEach(async (existingOrderItem) => {
          await queryRunner.query(
            `UPDATE order_item SET quantity = ? WHERE id = ?`,
            [cartItem.quantity, existingOrderItem.id]
          );
        });
      } else {
        await queryRunner.query(
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
            cartItem.product_items,
            cartItem.quantity,
            cartItem.price,
          ]
        );
      }
    }

    const orderItems = await queryRunner.query(
      `SELECT * FROM order_item WHERE order_id = ?`,
      [orderId]
    );
    const orderItemArray = Array.isArray(orderItems)
      ? orderItems
      : [orderItems];

    let totalAmount = 0;
    orderItemArray.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    await queryRunner.query(`UPDATE orders SET total_amount = ? WHERE id = ?`, [
      totalAmount,
      orderId,
    ]);

    await queryRunner.commitTransaction();
    return totalAmount;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw new DatabaseError('failed to update cart item quantity');
  } finally {
    await queryRunner.release();
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
    `SELECT
    'image_url', image_url
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
  const [{ addresses }] = await appDataSource.query(
    `SELECT 
    addresses
    FROM users
    WHERE id =?`,
    [userId]
  );
  return addresses;
};

const executedOrder = async (userId) => {
  try {
    const order = await findMatched(userId);
    const totalAmount = await updatedOrders(order[0].id);

    await appDataSource.query(
      `UPDATE users SET points = points-? WHERE id = ?`,
      [totalAmount, userId]
    );

    await appDataSource.query(`DELETE FROM cart WHERE user_id =?`, [userId]);

    await appDataSource.query(
      `UPDATE orders SET order_status_id =? WHERE user_id =?`,
      [orderStatusEnum.COMPLETED_PAYMENT, userId]
    );
  } catch (err) {
    const error = new DatabaseError('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createOrders,
  findMatched,
  getImageUrlByProductId,
  getUserInfoByUserId,
  executedOrder,
  createOrderAndItems,
};
