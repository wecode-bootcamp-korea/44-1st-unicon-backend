const appDataSource = require('./appDataSource');

const { v4 } = require('uuid');

const createOrders = async (userId, orderStatus) => {
  console.log('orderStatus: ' + orderStatus);
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
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
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
    console.log(resultArray);

    return resultArray;
  } catch (err) {
    throw new Error(
      `Failed to find matched orders for userId ${userId}: ${err.message}`
    );
  }
};

const createOrdersAndItems = async (userId, orderStatus) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();

  const orderNumber = v4();
  try {
    const { insertId } = await queryRunner.query(
      `INSERT INTO orders(
                user_id,
                order_number,
                order_status_id
                ) VALUES ( ?, ?, ?);
              `,
      [userId, orderNumber, orderStatus]
    );

    // cart 테이블에서 주문 상품 정보 가져오기
    const cartItems = await queryRunner.query(
      `
        SELECT cart.user_id, cart.product_id, cart.quantity, product.price 
        FROM cart
        JOIN product ON cart.product_id = product.id
        WHERE cart.user_id = ?
            `,
      [userId]
    );
    // 항상 배열 형태로 반환
    const cartItemArray = Array.isArray(cartItems) ? cartItems : [cartItems];

    // order_item 테이블에 주문 상품 정보 삽입
    for (const cartItem of cartItemArray) {
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
          insertId,
          cartItem.product_id,
          cartItem.quantity,
          cartItem.price,
        ]
      );
    }

    // orders 테이블에서 주문 상품의 총 가격 정보 업데이트
    const orderItems = await queryRunner.query(
      `SELECT * FROM order_item WHERE order_id = ?`,
      [insertId]
    );
    const orderItemArray = Array.isArray(orderItems)
      ? orderItems
      : [orderItems];
    let totalAmount = 0;
    for (let i = 0; i < orderItemArray.length; i++) {
      totalAmount += orderItemArray[i].price * orderItemArray[i].quantity;
    }

    await queryRunner.query(`UPDATE orders SET total_amount = ? WHERE id = ?`, [
      totalAmount,
      insertId,
    ]);

    // cart 테이블에서 해당 사용자의 장바구니 비우기
    await queryRunner.query(`DELETE FROM cart WHERE user_id =?`, [userId]);

    // orders 테이블에서 해당 사용자의 주문 상태 정보 업데이트
    await queryRunner.query(
      `UPDATE orders SET order_status_id =2 WHERE user_id =?`,
      [userId]
    );
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw new Error('failed to update cart item quantity'); 
  } finally {
    await queryRunner.release();
  }

};

const createOrderItems = async (userId, orderId) => {
  try {
    const cartItems = await appDataSource.query(
      `
      SELECT cart.user_id, cart.product_id, cart.quantity, product.price 
      FROM cart
      JOIN product ON cart.product_id = product.id
      WHERE cart.user_id = ?
    `,
      [userId]
    );
    const cartItemArray = Array.isArray(cartItems) ? cartItems : [cartItems];

    for (const cartItem of cartItemArray) {
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

    if (orderItemArray.length === 0) {
      `DELETE FROM orders WHERE orders.id =?`, [orderId];
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
    const order = await findMatched(userId);
    console.log('11111order :' + order);
    const totalAmount = await updatedOrders(order[0].id);

    await appDataSource.query(
      `UPDATE users SET points = points-? WHERE id = ?`,
      [totalAmount, userId]
    );

    await appDataSource.query(`DELETE FROM cart WHERE user_id =?`, [userId]);

    await appDataSource.query(
      `UPDATE orders SET order_status_id =2 WHERE user_id =?`,
      [userId]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createOrders,
  createOrderItems,
  findMatched,
  updatedOrders,
  getImageUrlByProductId,
  getUserInfoByUserId,
  executedOrder,
  createOrdersAndItems
};
