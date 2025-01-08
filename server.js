const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (error) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(`${error.name} ${error.message}`);

  server.close(() => {
    process.exit(1);
  });
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(
    DB
    // ,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // }
  )
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err.message));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port: ${port}....`);
});

process.on('unhandledRejection', (error) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(`${error.name} ${error.message}`);

  server.close(() => {
    process.exit(1);
  });
});

console.log(c);
