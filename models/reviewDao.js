const appDataSource = require('./appDataSource.js');
const { baseError } = require('../middlewares/error.js');

const createReview = async (title, content, rating, productId, userId) => {
  try {
    return await appDataSource.query(
      `INSERT INTO
      (title,
      content,
      rating,
      product_id,
      user_id) 
      VALUES(?,?,?,?,?)`,
      [title, content, rating, productId, userId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA_INPUT', 400);
  }
};

const isOrder = async (userId, productId) => {
  try {
    const [isOrder] = await appDataSource.query(
      `SELECT
      lists
    FROM receipt
    WHERE user_id = ?`,
      [userId]
    );
    const result = isOrder.filter((order) => order.productId == productId);
    return result;
  } catch (err) {
    throw new baseError('INVALID_DATA', 400);
  }
};

const reviewById = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT
    title,
    content,
    rating
    FROM review
    WHERE product_id = ?
    `,
      [productId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA', 400);
  }
};

const deleteReview = async (userId, productId) => {
  try {
    return await appDataSource.query(
      `DELETE FROM review
      WHERE user_id = ? AND product_id = ?
      `,
      [userId, productId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA', 400);
  }
};
module.exports = {
  createReview,
  isOrder,
  reviewById,
  deleteReview,
};
