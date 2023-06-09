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

const isOrder = async ({ userId, productId }) => {
  try {
    const lists = await appDataSource.query(
      `SELECT
      lists
    FROM receipt
    WHERE user_id = ?`,
      [userId]
    );
    const resultArray = Array.isArray(lists) ? lists : [lists];

    let result = [];
    resultArray.forEach((list) => {
      if (list.lists[0].lists.length == 1) {
        result.push(list.lists[0].lists[0].productId);
      } else {
        list.lists[0].lists.forEach((element) => {
          result.push(element.productId);
        });
      }
    });

    return result;
  } catch (err) {
    throw new DatabaseError('INVALID_DATA');
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
  isOrder,
  getReviewByProductId,
  deleteReview,
};
