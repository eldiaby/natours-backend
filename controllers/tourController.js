const fs = require('node:fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf-8')
);

module.exports.ckeckID = (req, res, next, value) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

module.exports.ckeckBody = (req, res, next) => {
  const body = req.body;
  console.log(body.name, body.price);

  if (!body?.name || !body?.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Missing name or price!',
    });
  }
  next();
};

module.exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

module.exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => +el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

module.exports.createTour = (req, res) => {
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

module.exports.updateTour = (req, res) => {
  const id = Number(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      message: `The tour ${id} has beed updated sucessfly.`,
    },
  });
};

module.exports.deleteTour = (req, res) => {
  // const id = req.params.id * 1;

  res.status(204).json({
    status: 'success',
    data: {
      // message: `The tour ${id} has beed deleted sucessfly.`,
      message: null,
    },
  });
};
