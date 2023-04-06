const appDataSource = require('./myDataSources');

const createCartItem = async ({ userId, productId, quantity }) => {
  try {
    const product = await appDataSource.query(
      'SELECT * FROM product where product.id =?',
      [productId]
    );
    if (product === 0) {
      throw new Error('Invalid product ');
    }
    await appDataSource.query(
      `INSERT INTO cart(user_id, product_id, quantity)
         VALUES (?, ?, ?)`,
      [userId, productId, quantity]
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
         JSON_OBJECT(
             'id', p.id,
             'names', p.names,
             'descriptions', p.descriptions,
             'sub_description', p.sub_description,
             'sub_category_id', p.sub_category_id,
             'product_size', p.product_size,
             'is_new', p.is_new,
             'price', p.price,
             'quantity', c.quantity
         )
    ) AS Lists
    FROM 
        users AS u            
        JOIN cart AS c
        ON  c.user_id = u.id 
        JOIN product AS p
        ON c.product_id = p.id
    WHERE 
        u.id = ?
    GROUP BY 
        u.id
    `,
    [userId]
  );

  const { Lists } = lists;
  const parsedLists = JSON.parse(Lists);

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
       SET quantity = ?
       WHERE user_id = ? AND product_id = ? `,
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
        WHERE c.user_id = ? AND c.product_id = ?
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
