const appDataSource = require('./appDataSource');

const { v4 } = require('uuid');

const createOrders = async (userId, orderStatus) => {
  console.log("orderStatus: " + orderStatus)  
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
    console.log(resultArray)
    
    return resultArray
  } catch (err) {
    throw new Error(
      `Failed to find matched orders for userId ${userId}: ${err.message}`
    );
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
    ); //row 결과가 하나일 경우 쿼리문은 배열이 아니라 단독 객체로 반환함
    // 항상 배열 형태로 반환
    const cartItemArray = Array.isArray(cartItems) ? cartItems : [cartItems];

    // const [orderTable] = await appDataSource.query(
    //   `SELECT *FROM orders WHERE orders.user_id = ?`,
    //   [userId]
    // );
    // const orderId = orderTable['id'];

    for (const cartItem of cartItemArray) { //장바구니 내에서 주문 호출 하게 되면 여기부터 트랜잭션 적용 
    
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
  )
};

const executedOrder = async(userId) => {
  try{
      const order = await findMatched(userId);
      console.log("11111order :" + order)
      const totalAmount = await updatedOrders(order[0].id);

      await appDataSource.query(
        `UPDATE users SET points = points-? WHERE id = ?`,
        [totalAmount, userId]
      )

      await appDataSource.query(
        `DELETE FROM cart WHERE user_id =?`,
        [userId]
      )

      await appDataSource.query(
        `UPDATE orders SET order_status_id =2 WHERE user_id =?`,
        [userId]
      )

  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
} 

module.exports = {
  createOrders,
  createOrderItems,
  findMatched,
  updatedOrders,
  getImageUrlByProductId,
  getUserInfoByUserId,
  executedOrder
};
