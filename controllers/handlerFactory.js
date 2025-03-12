const catchAsync = require('./../utilits/catchAsync.js');
const AppError = require('./../utilits/appError.js');

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
