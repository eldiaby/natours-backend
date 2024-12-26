const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middlewars

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(morgan('dev'));

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

// Server
module.exports = app;
