const appDataSource = require('./myDataSources');

const createCartItem = async ({ userId, productId, quantity }) => {
  try {
    const product = await appDataSource.query(
      'SELECT * FROM product where product.id =?',
      [productId]
    );

    console.log('product: ' + product);

    const [item] = await appDataSource.query(
      //json
      `SELECT JSON_OBJECT(
             'product_id', p.id,
             'name', p.names,
             'descriptions', p.descriptions,
              'sub_descriptions', p.sub_descriptions,
              'product_size', p.product_size,
             'price', p.price
           ) AS item
         FROM product AS p
         WHERE p.id = ?`,
      [productId]
    );
    console.log('item: ' + item[0]);
    await appDataSource.query(
      `INSERT INTO cart(user_id, item)
         VALUES (?, ?)`,
      [userId, JSON.stringify({ ...item, quantity })]
    );

    return { message: 'cartItem added to your cart' };
  } catch (error) {
    console.error(error);
    throw new Error('failed to create cart item');
  }
};

const findMatched = async (productId) => {
  try {
    return await appDataSource.query(`SELECT * FROM product WHERE id = ?`, [
      productId,
    ]);
  } catch {
    const error = new Error('datasource error, couldnt find product');
    error.statusCode = 400;

    throw error;
  }
};

const getCartList = async (userId) => {
  const [lists] = await appDataSource.query(
    `SELECT 
            u.id AS userId,
            JSON_ARRAYAGG(
                 c.item
            ) AS Lists
          FROM 
            users AS u            
            JOIN cart AS c
            ON  c.user_id = u.id 
          WHERE 
            u.id = ?
          GROUP BY 
            u.id
          `,
    [userId]
  );

  const parsedLists = JSON.parse(lists.Lists);
  
  const updatedLists = parsedLists.map((item) => {
    const { price, quantity } = item;
    const total_price = price * quantity;
    return { ...item, total_price };
  });

  const totalSum = updatedLists.reduce(
    (accumulator, currentValue) => accumulator + currentValue.total_price,
    0
  );

  return { Lists: updatedLists, totalSum };
};



const updateCartItemQuantity = async ({ userId, productId, quantity }) => {
  try {
    await appDataSource.query(
      `UPDATE cart
       SET item = JSON_SET(item, '$.quantity', ?)
       WHERE user_id = ? AND JSON_EXTRACT(item, '$.id') = ?`,
      [quantity, userId, productId]
    );
    return { message: 'cartItem quantity updated' };
  } catch (error) {
    console.error(error);
    throw new Error('failed to update cart item quantity');
  }
};


const deleteCart = async ({ userId, productId }) => {
  await appDataSource.query(
    `
        DELETE
        FROM cart AS c
        WHERE c.user_id = ? AND JSON_EXTRACT(item, '$.id') = ?
      `,
    [userId, productId]
  );
};

module.exports = {
  createCartItem,
  findMatched,
  getCartList,
  updateCartItemQuantity,
  deleteCart,
};
