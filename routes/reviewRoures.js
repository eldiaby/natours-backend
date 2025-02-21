const express = require('express');

const reviewController = require('./../controllers/reviewController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
  .route('/')
  .get(reviewController.gerAllReviews)
  .post(
    authController.prodect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
