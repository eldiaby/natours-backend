const fs = require('node:fs');
const express = require('express');

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from the other side...',
//     app: 'natourse',
//   });
// });

// app.post('/', (req, res) => {
//   res.status(200).send(`You can't post at that endpoind...`);
// });

// app.delete('/users', (req, res) => {
//   res.status(200).send(`You can't delete at this endpoint...`);
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8')
);

// Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get a spacifc tour
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// Post a new tour
app.post('/api/v1/tours', (req, res) => {
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
});

// Update a tour
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

// Delete a tour
app.delete('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;

app.listen(port, () => {
  console.log(`App is working on port ${port}...`);
});
