const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
// const xss = require('xss-clean');

const path = require('node:path');

const viewRouter = require('./routes/viewRouter.js');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoures.js');
const AppError = require('./utilits/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

// Server side rendering
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) Global Middlewars

console.log(path.join(__dirname, 'public'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set securty HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requists from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});
app.use('/api', limiter);

// app.use(morgan('dev'));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against
// app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
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
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
