const express = require('express');

const reviewController = require('./../controllers/reviewController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.gerAllReviews)
  .post(
    authController.prodect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
