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
    throw new baseError('INVALID_DATA_INPUT', 500);
  }
};

const isOrder = async (userId, productId) => {
  try {
    return await appDataSource.query(
      `SELECT
    user_id,
    product_id
    FROM //미정 결제완료 테이블
    WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
  } catch (err) {
    throw new baseError('INVALID_DATA', 500);
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
    throw new baseError('INVALID_DATA', 500);
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
    throw new baseError('INVALID_DATA');
  }
};
module.exports = {
  createReview,
  isOrder,
  reviewById,
  deleteReview,
};
