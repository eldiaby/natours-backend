const catchAsync = require('./../utilits/catchAsync.js');
const AppError = require('./../utilits/appError.js');
const APIFeatures = require('../utilits/apiFeatur.js');

module.exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // If there is a spacific tour then get all reviews for this tour else get all treviews in general
    let filter = {}; // To allow for nested GET reviews on tour (hack)
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // Send the response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

module.exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Get the query with this populate if there is
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`there is no tour with this ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

module.exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`there is no document with this ID`, 404));
    }

    res.status(204).json({
      status: 'Success',
      message: 'Have been deleted successfly',
    });
  });

module.exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`there is no document with this ID`, 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

module.exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: doc,
    });
  });
