const appDataSource = require('./appDataSource');

const Order = async (user_id, order_number, total_amount) => {
  try {
    const user = await appDataSource.query(
      `INSERT INTO orders(
		      user_id,
          order_number,
          total_amount
       ) VALUES (?, ?, ?, );
		  `,
      [user_id, order_number, total_amount]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    console.log(err);
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  Order,
};
