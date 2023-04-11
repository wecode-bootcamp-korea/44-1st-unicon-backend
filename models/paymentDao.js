const appDataSource = require('./appDataSource');

const createPayment = async (orderNumber) => {
  try {
    const [{ orderId }] = await appDataSource.query(
      `SELECT
        orders.id AS orderId
        FROM orders
        WHERE order_number = ?`,
      [orderNumber]
    );

    const [{ userId, lists }] = await appDataSource.query(
      `SELECT
          order_item.user_id AS userId,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              "productId", order_item.product_id,
              "quantity", order_item.quantity,
              "price", order_item.price
            )
           ) as lists,
           
        FROM order_item
        WHERE order_item.order_id = ${orderId}
        GROUP BY order_item.user_id
        `
    );

    const totalAmount = lists.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0
    );

    return await appDataSource.query(
      `INSERT INTO receipt(
        order_id, 
        order_number,
        user_id,
        lists,
        total_amout
        ) VALUES(?, ?, ?, ?, ?)
      `,
      [orderId, orderNumber, userId, lists, totalAmount]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  createPayment,
};
