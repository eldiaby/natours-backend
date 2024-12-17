const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from the other side...',
    app: 'natourse',
  });
});

app.post('/', (req, res) => {
  res.status(200).send(`You can't post at that endpoind...`);
});

const port = 8000;

app.listen(port, () => {
  console.log(`App is working in port ${port}...`);
});
