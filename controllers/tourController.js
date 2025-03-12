const Tour = require('../module/tourModule.js');
const APIFeatures = require('../utilits/apiFeatur.js');
const catchAsync = require('./../utilits/catchAsync.js');
const AppError = require('./../utilits/appError.js');
const Factory = require('./handlerFactory.js');

module.exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,price,summary,difficulty';

  next();
};

module.exports.getAllTours = catchAsync(async (req, res, next) => {
  // Baild query

  // // 2) Sorting

  // // 3) Field limiting

  // // 4) pagination

  // Execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // Send the response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

module.exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({ path: 'reviews' });

  if (!tour) {
    return next(new AppError(`there is no tour with this ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
  // const id = +req.params.id;
  // // const tour = tours.find((el) => +el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
});

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
