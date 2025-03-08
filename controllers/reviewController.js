const Review = require('./../module/reviewModel.js');
const catchAsync = require('./../utilits/catchAsync.js');

module.exports.gerAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

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

module.exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
