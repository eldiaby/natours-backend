const Tour = require('../module/tourModule.js');
const catchAsync = require('./../utilits/catchAsync.js');
const Factory = require('./handlerFactory.js');
// const AppError = require('./../utilits/appError.js');

module.exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,price,summary,difficulty';

  next();
};

module.exports.getAllTours = Factory.getAll(Tour);

module.exports.getTour = Factory.getOne(Tour, { path: 'reviews' });

module.exports.createTour = Factory.createOne(Tour);

module.exports.updateTour = Factory.updateOne(Tour);

module.exports.deleteTour = Factory.deleteOne(Tour);

module.exports.getTourStats = catchAsync(async (req, res, next) => {
  // Set the tours stats
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);

  // Send the response
  res.status(200).json({
    status: 'Success',
    results: stats.length,
    data: {
      stats,
    },
  });
});

module.exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});
