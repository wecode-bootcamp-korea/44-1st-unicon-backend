const reviewDao = require('../models/reviewDao.js');
const { baseError } = require('../middlewares/error');

const createReview = async (title, content, rating, productId, userId) => {
  const isOrder = await reviewDao.isOrder(userId, productId);

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

const getReviewByProductId = async (productId) => {
  const review = await reviewDao.getReviewByProductId(productId);

  if (review.length == 0) {
    throw new baseError('NOT_REVIEW', 404);
  }

  return review;
};

const deleteReview = async (userId, productId, reviewId) => {
  const review = await reviewDao.deleteReview(userId, productId, reviewId);

  if (review.affectedRows == 0)
    throw new baseError('NOT_YOUR_POST_CAN_NOT_DELETE', 401);

  return review;
};

module.exports = { createReview, getReviewByProductId, deleteReview };
