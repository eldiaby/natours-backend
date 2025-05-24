const Tour = require('./../module/tourModule.js');
const catchAsync = require('./../utilits/catchAsync.js');

module.exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get the all tours data from the database
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'Overview all tours',
    tours,
  });
});

module.exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      select: 'review rating user',
    })
    .lean();
  // res.send(tour);
  res.status(200).render('tour', {
    title: 'The forst hicker tour',
    tour,
  });
});
