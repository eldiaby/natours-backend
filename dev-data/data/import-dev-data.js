const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: '../../config.env' });
const Tour = require('../../module/tourModule');
const fs = require('node:fs');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// Read data from the file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Importing the data to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Deleting all data from DB
const deleteDate = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteDate();
}

// console.log(process.argv);
