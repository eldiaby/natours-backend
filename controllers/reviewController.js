const Review = require('./../module/reviewModel.js');
const Factory = require('./handlerFactory.js');
// const catchAsync = require('./../utilits/catchAsync.js');

// Create review
module.exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

module.exports.gerAllReviews = Factory.getAll(Review);

module.exports.getReview = Factory.getOne(Review);

module.exports.createReview = Factory.createOne(Review);

module.exports.updateReview = Factory.updateOne(Review);

module.exports.deleteReview = Factory.deleteOne(Review);
