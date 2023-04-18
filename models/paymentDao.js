const appDataSource = require('./appDataSource');
const { orderStatusEnum } = require('../middlewares/enums');

const createPayment = async (orderNumber) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();
  try {
  
    const orderInfo = await queryRunner.query(
      `SELECT
          orders.id AS orderId,
          user_id AS userId,
           total_amount AS totalAmount
       FROM orders
       WHERE order_number = ?`,
      [orderNumber]
    );

    const orderInfoArray = Array.isArray(orderInfo) ? orderInfo : [orderInfo];

    const userId = orderInfoArray[0].userId;
    const totalAmount = orderInfoArray[0].totalAmount;
    const orderId = orderInfoArray[0].orderId;

    await queryRunner.query(
      `UPDATE users SET points = points - ? WHERE id = ?`,
      [totalAmount, userId]
    );

    const updatePoint = await queryRunner.query(
      `SELECT points FROM users WHERE users.id = ?`,
      [userId]
    );

    const getProductName = await queryRunner.query(
      `SELECT p.names
      FROM product p
      JOIN order_item oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.user_id = ? AND o.id = ?;
      `,
      [userId, orderId]
    );

    await queryRunner.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);

    const completePayMent = orderStatusEnum.COMPLETE_PAYMENT;

    await queryRunner.query(
      `UPDATE orders SET order_status_id =? WHERE id =?`,
      [completePayMent, orderId]
    );

    const lists = await queryRunner.query(
      `SELECT 
          order_item.user_id AS UserId,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  "productId", order_item.product_id,
                  "quantity", order_item.quantity,
                  "price", order_item.price
                  )
                ) as lists
       FROM order_item
       WHERE order_item.order_id = ?
       GROUP BY order_item.user_id
      `,
      [orderId]
    );
    const listsArray = Array.isArray(lists) ? lists : [lists];

    const stringifyList = JSON.stringify(listsArray[0].lists);

    await queryRunner.query(
      `INSERT INTO receipt(
        order_id, 
        order_number,
        user_id,
        lists,
        total_amount
        ) VALUES(?, ?, ?, ?, ?)
      `,
      [orderId, orderNumber, userId, stringifyList, totalAmount]
    );

    await queryRunner.commitTransaction();

    return [totalAmount, updatePoint, getProductName];
  } catch (err) {
    await queryRunner.rollbackTransaction();
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  } finally {
    queryRunner.release();
  }
};

module.exports = {
  createPayment,
};
