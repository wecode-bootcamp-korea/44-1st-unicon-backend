const appDataSource = require('./appDataSource');

const createCartItem = async ({ userId, productId, quantity }) => {
  try {
    if (quantity <= 0) {
      const error = new Error('quantity must be more than 0');
      error.statusCode = 400;

      throw error;
    }

    const product = await appDataSource.query(
      'SELECT * FROM product where product.id = ?',
      [productId]
    );
    const productArray = Array.isArray(product) ? product : [product];

    if (productArray.length === 0) {
      const error = new Error(`product with ID ${productId} not found`);
      error.statusCode = 400;

      throw error;
    }

    const existingCartItem = await cartDao.findMatchedProductId(productId);
    if (existingCartItem.length === 0) {
      await cartDao.createCartItem({ userId, productId, quantity });
    } else {
      await cartDao.addCartItemQuantity({ userId, productId, quantity });
    }

    return 'cartItem created';
  } catch (err) {
    console.error(err);
    throw new Error('failed to create cart');
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
  const result = await appDataSource.query(
    `SELECT 
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'cart_id', c.id,
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
    cart AS c 
    JOIN product AS p           
    ON c.product_id = p.id
  WHERE 
    c.user_id = ?
  ORDER BY c.id DESC
  
    `,
    [userId]
  );
  const lists = result[0].Lists;
  console.log(lists);

  if (!lists || lists.length === 0) {
    return [];
  }

  const updatedLists = lists.reverse().map((item) => {
    const { price, quantity } = item;
    const totalPrice = price * quantity;
    return { ...item, totalPrice };
  });

  const totalItemPrice = updatedLists.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalPrice,
    0
  );

  return updatedLists;
};

const updateCartItemQuantity = async (quantity, userId, productId) => {
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

const deleteCart = async (userId, productId) => {
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
