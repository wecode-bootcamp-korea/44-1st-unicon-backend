const reviewDao = require('../models/reviewDao.js');
const { baseError } = require('../middlewares/error');

const createReview = async (title, content, rating, productId, userId) => {
  const isOrder = await reviewDao.checkOrders(userId, productId);

  if (isOrder.length == 0) {
    throw new baseError('NOT_IN_ORDER', 403);
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
    throw new baseError('NOT_REVIEW', 404);
  }
  return review;
};
module.exports = { createReview, reviewById };
