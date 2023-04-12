const express = require('express');
const reviewController = require('../controllers/reviewController');
const { loginRequired } = require('../middlewares/auth');
const router = express.Router();

router.post('', loginRequired, reviewController.createReview);
router.delete(
  '/:productId/:reviewId',
  loginRequired,
  reviewController.deleteReview
);
router.get('/:productId', reviewController.reviewById);

module.exports = {
  router,
};
