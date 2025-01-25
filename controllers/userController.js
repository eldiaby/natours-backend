const User = require('./../module/userModule.js');
const catchAsync = require('./../utilits/catchAsync.js');

module.exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};

module.exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};

module.exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};

module.exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};
