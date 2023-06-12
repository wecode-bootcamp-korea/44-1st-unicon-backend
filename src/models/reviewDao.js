const appDataSource = require('./appDataSource');
const { DatabaseError } = require('../middlewares/error.js');

const createReview = async ({ title, content, rating, productId, userId }) => {
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

const getReviewByProductId = async (productId) => {
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
    throw new DatabaseError('INVALID_DATA');
  }
};

const deleteReview = async ({ userId, productId, reviewId }) => {
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
  getReviewByProductId,
  deleteReview,
};
