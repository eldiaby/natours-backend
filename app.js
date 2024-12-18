const fs = require('node:fs');
const express = require('express');
const { request } = require('node:http');
const morgan = require('morgan');
const app = express();

// 1) Middlewars

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8')
);

// 2) Routs handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => +el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours.length;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    'utf-8',
    (error) => {
      res.status(201).json(newTour);
    }
  );
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      message: `The tour ${id} has beed updated sucessfly.`,
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: {
      // message: `The tour ${id} has beed deleted sucessfly.`,
      message: null,
    },
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: `This route didn't implement yet!`,
  });
};

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
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// Server
const port = 3000;

app.listen(port, () => {
  console.log(`App is working on port ${port}...`);
});
