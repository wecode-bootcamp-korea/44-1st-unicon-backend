const appDataSource = require('../models/appDataSource');
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

  let totalAmount = 0;
  for (let i = 0; i < cartArray.length; i++) {
    totalAmount += cartArray[i].quantity * cartArray[i].price;
  }

  const [userPoints] = await appDataSource.query(
    `SELECT
          points
        FROM users
        WHERE id =?`,
    [userId]
  );
  console.log(typeof userPoints);
  console.log(userPoints.points);
  console.log(typeof totalAmount);
  console.log(totalAmount);

  console.log(userPoints.points - totalAmount);
  if (userPoints.points - totalAmount < 0) {
    const err = new Error('NOT ENOUGH POINTS TO PURCHASE');
    err.statusCode = 401;
    console.log(err.message);
    throw err;
  }
};

module.exports ={priceErrorHandle}