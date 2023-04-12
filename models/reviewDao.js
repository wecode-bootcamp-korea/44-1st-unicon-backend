const appDataSource = require('./appDataSource.js');
const { DatabaseError } = require('../middlewares/error.js');

const createReview = async (title, content, rating, productId, userId) => {
  try {
    return await appDataSource.query(
      `INSERT INTO review
      (title,
      content,
      rating,
      product_id,
      user_id) 
      VALUES(?,?,?,?,?)`,
      [title, content, rating, productId, userId]
    );
  } catch (err) {
    throw new DatabaseError('INVALID_DATA_INPUT');
  }
};

const isOrder = async (userId, productId) => {
  try {
    const [{ lists }] = await appDataSource.query(
      `SELECT
      lists
    FROM receipt
    WHERE user_id = ?`,
      [userId]
    );
    const result = lists.filter((order) => order.productId == productId);
    return result;
  } catch (err) {
    throw new DatabaseError('INVALID_DATA');
  }
};

const reviewById = async (productId) => {
  try {
    return await appDataSource.query(
      `SELECT
      id,
    title,
    content,
    rating
    FROM review
    WHERE product_id = ?
    `,
      [productId]
    );
  } catch (err) {
    console.log(err);
    throw new DatabaseError('INVALID_DATA');
  }
};

const deleteReview = async (userId, productId, reviewId) => {
  try {
    return await appDataSource.query(
      `DELETE FROM review
      WHERE user_id = ? AND product_id = ? AND id =?
      `,
      [userId, productId, reviewId]
    );
  } catch (err) {
    throw new DatabaseError('INVALID_DATA');
  }
};
module.exports = {
  createReview,
  isOrder,
  reviewById,
  deleteReview,
};
