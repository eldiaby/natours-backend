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

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

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

const port = 3000;

app.listen(port, () => {
  console.log(`App is working on port ${port}...`);
});
