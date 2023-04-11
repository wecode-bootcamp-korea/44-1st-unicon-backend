const reviewService = require('../services/reviewService.js');
const { catchError } = require('../middlewares/error.js');

const createReview = catchError(async (req, res) => {
  const userId = req.user;

  if (!userId) {
    return res.status(403).json({ message: 'INVALID_DATA_ID' });
  }
  const { title, content, rating, productId } = req.body;

  if (!title || !content || !rating || !productId) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }

  const review = await reviewService.createReview(
    title,
    content,
    rating,
    productId,
    userId
  );

  return res.status(201).json(review);
});

const reviewById = catchError(async (req, res) => {
  const productId = req.params;

  if (!productId) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }
  const review = await reviewService.reviewById(productId);
  return res.status(200).json(review);
});

const deleteReview = catchError(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'KEY_ERROR' });
  }

  const deleteReview = await reviewService.deleteReview(userId, productId);

  return res.status(204);
});
module.exports = {
  createReview,
  reviewById,
  deleteReview,
};
