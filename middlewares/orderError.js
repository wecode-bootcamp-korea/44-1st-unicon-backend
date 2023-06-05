const appDataSource = require('../models/appDataSource');
const { DatabaseError } = require('./error');

const priceErrorHandle = async (userId) => {
  const cart = await appDataSource.query(
    ` SELECT
        c.quantity,
        p.price
        FROM
         cart AS c
         JOIN product AS p 
         ON c.product_items = p.id
       WHERE c.user_id = ?;  `,
    [userId]
  );

  const cartArray = Array.isArray(cart) ? cart : [cart];

  const totalAmount = cartArray.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  const [userPoints] = await appDataSource.query(
    `SELECT
          points
        FROM users
        WHERE id =?`,
    [userId]
  );

  if (userPoints.points - totalAmount < 0) {
    throw createError(401, 'NOT ENOUGH POINTS TO PURCHASE');
  }
};

const emptyCartErrorHandle = async (userId) => {
  const cart = await appDataSource.query(
    `SELECT 
      *
    FROM 
      cart
    WHERE user_id =?`,
    [userId]
  );
  if (cart.length === 0) {
    throw createError(401, "NO ITEM IN USER'S CART");
  }
};

const createError = (statusCode, message) => {
  const err = new DatabaseError(message);
  err.statusCode = statusCode;
  console.log(err.message);
  return err;
};

module.exports = { priceErrorHandle, emptyCartErrorHandle };
