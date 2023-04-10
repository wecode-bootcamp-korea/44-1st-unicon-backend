const appDataSource = require('./appDataSource');

const createCartItem = async ({ userId, productId, quantity }) => {
  try {
    const product = await appDataSource.query(
      'SELECT * FROM product where product.id =?',
      [productId]
    );
    if (product <= 0) {
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

const findMatchedProductId = async (productId) => {
  return await appDataSource.query(`SELECT * FROM cart WHERE product_id = ?`, [
    productId,
  ]);
};

const findMatched = async (productId) => {
  return await appDataSource.query(`SELECT * FROM product WHERE id = ?`, [
    productId,
  ]);
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

  const updatedLists = lists.Lists.map((item) => {
    const { price, quantity } = item;
    const totalPrice = price * quantity;
    return { ...item, totalPrice }; //모든 객체의 속성을 새로운 객체에 복사
  });

  const totalItemPrice = updatedLists.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalPrice,
    0
  );

  return { updatedLists, totalItemPrice };
};

const updateCartItemQuantity = async ({ userId, productId, quantity }) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();
  try {
    await queryRunner.query(
      `UPDATE cart
       SET quantity = ?
       WHERE cart.user_id = ? AND cart.product_id = ? `,
      [quantity, userId, productId]
    );

    const [updatedCartItem] = await queryRunner.query(
      `SELECT 
         id, user_id, product_id, quantity
       FROM cart
       WHERE cart.user_id = ? AND cart.product_id = ?`,
      [userId, productId]
    );

    await queryRunner.commitTransaction();
    return { message: 'cartItem quantity updated', updatedCartItem };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error('failed to update cart item quantity');
  } finally {
    await queryRunner.release();
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
  return 'cartDeleted';
};

const addCartItemQuantity = async ({ userId, productId, quantity }) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();

  await queryRunner.startTransaction();
  try {
    await queryRunner.query(
      `UPDATE cart
       SET quantity = quantity+ ?
       WHERE cart.user_id = ? AND cart.product_id = ? `,
      [quantity, userId, productId]
    );
    const [updatedCartItem] = await queryRunner.query(
      `SELECT 
         id, user_id, product_id, quantity
       FROM cart
       WHERE cart.user_id = ? AND cart.product_id = ?`,
      [userId, productId]
    );
    await queryRunner.commitTransaction();
    return { message: 'cartItem quantity updated', updatedCartItem };
  } catch (error) {
    console.error(error);
    await queryRunner.rollbackTransaction();
    throw new Error('failed to update cart item quantity');
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  createCartItem,
  findMatched,
  getCartList,
  updateCartItemQuantity,
  deleteCart,
  findMatchedProductId,
  addCartItemQuantity,
};
