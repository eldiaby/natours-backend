const { promisify } = require('node:util');
const User = require('./../module/userModule.js');
const catchAsync = require('./../utilits/catchAsync.js');
const jwt = require('jsonwebtoken');
const AppError = require('./../utilits/appError.js');
const sendEmail = require('./../utilits/email.js');

// Local functions

const sighToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Global functions

module.exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = sighToken(newUser._id);

  res.status(201).json({
    status: 'Success',
    token,
    data: { user: newUser },
  });
});

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password is exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Ckeck if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  console.log(user.email, user.correctPassword);

  if (!user || (await user.correctPassword(user.password, password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3) If everything is ok, Send token to client
  const token = sighToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
};

module.exports.prodect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if it's there
  let token;

  if (
    req.headers?.authorization &&
    req.headers?.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not loged in! Please log in first', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3) Ckeck if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  // 4) Ckeck if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(currentUser.iat)) {
    return next(
      new AppError('User recently chanded password! Please log in again.', 401)
    );
  }

  // Frant access to protected route
  req.user = currentUser;
  next();
});

module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('You are not have permission to perform this action', 403)
      );
    }

    // Pass if role allow to do that action
    next();
  };
};

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //  3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwoordConfirm to: ${resetURL}. \nIf you didn't forget your password, Please ignore this email!`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email! Please check your email',
    });
  } catch (error) {
    user.passwordReserToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again later!',
        500
      )
    );
  }
});

module.exports.resetPassword = (req, res, next) => {
  console.log('Done');
};
