const reviewDao = require('../models/reviewDao.js');

const createReview = async (title, content, rating, productId, userId) => {
  const isOrder = await reviewDao.checkOrders(userId, productId);

  if (isOrder.length == 0) {
    const err = new Error('NOT_IN_ORDER');
    err.statusCode = 403;
    throw err;
  }

  return await reviewDao.createReview(
    title,
    content,
    rating,
    productId,
    userId
  );
};

const reviewById = async (productId) => {
  const review = await reviewDao.reviewById(productId);
  if (review.length == 0) {
    const err = new Error('NOT_REVIEW');
    err.statusCode = 400;
    throw err;
  }
  return review;
};
module.exports = { createReview, reviewById };
