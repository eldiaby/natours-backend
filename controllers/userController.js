const User = require('./../module/userModule.js');
const catchAsync = require('./../utilits/catchAsync.js');
const AppError = require('./../utilits/appError.js');
const Factory = require('./handlerFactory.js');

// local functions
const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};

  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) filteredObj[key] = obj[key];
  });

  return filteredObj;
};

// Global functions

module.exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route is not defined! Please use /signup insted`,
  });
};

module.exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) if the user want to update the password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for change password, Please visit ./updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // 4) Send the response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

module.exports.gerMe = (req, res, next) => {
  // get the current user id from the req.user and pass it for the req.params
  req.params.id = req.user.id;
  next();
};

module.exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports.getAllUsers = Factory.getAll(User);

module.exports.getUser = Factory.getOne(User);

// This not update the password
module.exports.updateUser = Factory.updateOne(User);

// Delete a user
module.exports.deleteUser = Factory.deleteOne(User);
