const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      require: [true, 'Please put a rating'],
      min: 1,
      Max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      require: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtauls: true },
    toObject: { virtauls: true },
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
