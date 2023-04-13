const appDataSource = require('./appDataSource');
const { DatabaseError } = require('../middlewares/error');

const createCartItem = async ({ userId, productId, quantity }) => {
  try {
    const product = await appDataSource.query(
      'SELECT * FROM product where product.id =?',
      [productId]
    );
    if (product <= 0) {
      throw new DatabaseError('Invalid product');
    }
    await appDataSource.query(
      `INSERT INTO cart(user_id, product_items, quantity)
          VALUES (?, ?, ?)`,
      [userId, productId, quantity]
    );

    return { message: 'cartItem added to your cart' };
  } catch (error) {
    throw new DatabaseError('failed to create cart item');
  }
};

const findMatchedProductId = async (productId) => {
  const cart = await appDataSource.query(
    `SELECT * FROM cart WHERE product_items = ?`,
    [productId]
  );
  const cartArray = Array.isArray(cart) ? cart : [cart];

  return cartArray;
};

const findMatched = async (productId) => {
  const product = await appDataSource.query(
    `SELECT * FROM product WHERE id = ?`,
    [productId]
  );
  const productArray = Array.isArray(product) ? product : [product];

  return productArray;
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
        'quantity', c.quantity,
        'image_url',image.image_url
      )
    ) AS Lists
  FROM
    cart AS c
    JOIN product AS p
    ON c.product_items = p.id
    JOIN  (SELECT product_id, JSON_ARRAYAGG(image_url) AS image_url FROM product_image GROUP BY product_id) AS image
      ON image.product_id = p.id
  WHERE
    c.user_id = ?
    `,
    [userId]
  );
  const lists = result[0].Lists;

  if (!lists || lists.length === 0) {
    return [];
  }

  const updatedLists = lists.reverse().map((item) => {
    const { price, quantity } = item;
    const totalPrice = price * quantity;
    return { ...item, totalPrice };
  });

  return updatedLists;
};

const updateCartItemQuantity = async ({ quantity, userId, productId }) => {
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.query(
      `UPDATE cart
       SET quantity = ?
       WHERE cart.user_id = ? AND cart.product_items = ? `,
      [quantity, userId, productId]
    );

    const [updatedCartItem] = await queryRunner.query(
      `SELECT
         id, user_id, product_items, quantity
       FROM cart
       WHERE cart.user_id = ? AND cart.product_items = ?`,
      [userId, productId]
    );

    await queryRunner.commitTransaction();

    return { message: 'cartItem quantity updated', updatedCartItem };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new DatabaseError('failed to update cart item quantity');
  } finally {
    await queryRunner.release();
  }
};

const deleteCart = async ({userId, productId}) => {
  await appDataSource.query(
    `
        DELETE
        FROM cart AS c
        WHERE c.user_id = ? AND c.product_items = ?
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
       WHERE cart.user_id = ? AND cart.product_items = ? `,
      [quantity, userId, productId]
    );

    const [updatedCartItem] = await queryRunner.query(
      `SELECT
         id, user_id, product_items, quantity
       FROM cart
       WHERE cart.user_id = ? AND cart.product_items = ?`,
      [userId, productId]
    );

    await queryRunner.commitTransaction();

    return { message: 'cartItem quantity updated', updatedCartItem };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new DatabaseError('failed to update cart item quantity');
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
