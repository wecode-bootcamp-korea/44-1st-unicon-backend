const appDataSource = require('./appDataSource');
const { orderStatusEnum } = require('../middlewares/enums');

const createPayment = async (orderNumber) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();
  try {
    const re = await queryRunner.query(
      `SELECT
          orders.id AS orderId,
          user_id AS userId,
           total_amount AS totalAmount
       FROM orders
       WHERE order_number = ?`,
      [orderNumber]
    );
  
    await queryRunner.query(
      `UPDATE users SET points = points - ? WHERE id = ?`,
      [totalAmount, userId]
    );

    const [{ points }] = await queryRunner.query(
      `SELECT points FROM users WHERE users.id = ?`,
      [userId]
    );

    const [{ getProductName }] = await queryRunner.query(
      `  SELECT product.names AS getProductName FROM product 
      JOIN cart ON product.id = cart.product_items WHERE cart.user_id= ?`,
      [userId]
    );

    await queryRunner.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);

    await queryRunner.query(
      `UPDATE orders SET order_status_id =? WHERE user_id =?`,
      [orderStatusEnum.COMPLETE_PAYMENT, userId]
    );

    const [{ lists }] = await queryRunner.query(
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

    const stringifyList = JSON.stringify(lists);

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

    return [
      {
        totalAmount: totalAmount,
        updatePoint: points,
        productName: getProductName,
      },
    ];
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
