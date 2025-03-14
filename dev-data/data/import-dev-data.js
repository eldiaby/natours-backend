const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: __dirname + '/../../config.env' });
const Tour = require('../../module/tourModule.js');
const User = require('../../module/userModule.js');
const Review = require('../../module/reviewModel.js');
const fs = require('node:fs');

console.log(process.env.DATABASE, process.env.DATABASE_PASSWORD);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// Read data from the file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// Importing the data to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validationBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Deleting all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);
