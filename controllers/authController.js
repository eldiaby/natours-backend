const crypto = require('node:crypto');
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

const createSendToken = (user, statusCode, res) => {
  // Create the token
  const token = sighToken(user._id);

  // Send the data
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: { user },
  });
};

// ================================================ //
// Global functions

module.exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password is exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Ckeck if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || (await user.correctPassword(user.password, password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3) If everything is ok, Send token to client
  createSendToken(user, 200, res);
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

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordReserToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordReserToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // Implement this on the User.schema

  // 4) Log the user in, Send JWT
  createSendToken(user, 201, res);
});

module.exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, Send JWT
  createSendToken(user, 201, res);
});
