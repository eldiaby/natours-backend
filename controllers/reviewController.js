const Review = require('./../module/reviewModel.js');
const catchAsync = require('./../utilits/catchAsync.js');
const Factory = require('./handlerFactory.js');

module.exports.gerAllReviews = catchAsync(async (req, res, next) => {
  // If there is a spacific tour then get all reviews for this tour else get all treviews in general
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

module.exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.body.id);

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

// Create review

module.exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

module.exports.createReview = Factory.createOne(Review);

module.exports.updateReview = Factory.updateOne(Review);

module.exports.deleteReview = Factory.deleteOne(Review);
