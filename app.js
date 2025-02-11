const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utilits/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

// 1) Global Middlewars

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// // Get all tours
// app.get('/api/v1/tours', getAllTours);

// // Get a spacifc tour
// app.get('/api/v1/tours/:id', getTour);

// // Post a new tour
// app.post('/api/v1/tours', createTour);

// // Update a tour
// app.patch('/api/v1/tours/:id', updateTour);

// // Delete a tour
// app.delete('/api/v1/tours/:id', deleteTour);

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all(`*`, (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const error = new Error(`Can't find ${req.originalUrl} on this server`);
  // error.statusCode = 404;
  // error.status = 'Fail';
  // next(error);

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// Server
module.exports = app;
