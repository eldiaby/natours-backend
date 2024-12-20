const express = require('express');
const fs = require('node:fs');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.param('id', tourController.ckeckID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.ckeckBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
