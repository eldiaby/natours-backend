const express = require('express');
const authController = require('./../controllers/authController.js');
// const fs = require('node:fs');
const tourController = require('./../controllers/tourController');
const reviewRouter = require('./../routes/reviewRoures.js');

const router = express.Router();

// router.param('id', tourController.ckeckID);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.prodect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// Add a new review to the current tour
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
