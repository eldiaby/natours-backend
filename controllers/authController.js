const User = require('./../module/userModule.js');
const catchAsunc = require('./../utilits/catchAsync.js');

module.exports.signup = catchAsunc(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'Success',
    data: newUser,
  });
});
