const Review = require('../models/Review');
const AppError = require('../utils/AppError');

const getBookReviews = async (bookId) => {
  const reviews = await Review.find({ book: bookId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  return { reviews };
};

const getAllReviews = async () => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('book', 'title author')
    .sort({ createdAt: -1 });
  return { reviews };
};

const getMyReviews = async (userId) => {
  const reviews = await Review.find({ user: userId })
    .populate('book', 'title author image')
    .sort({ createdAt: -1 });
  return { reviews };
};

const createReview = async (userId, data) => {
  const existing = await Review.findOne({ user: userId, book: data.bookId });
  if (existing) throw new AppError('Ya calificaste este libro', 400);

  const review = await Review.create({
    user: userId,
    book: data.bookId,
    rating: data.rating,
    comment: data.comment || '',
  });

  return review.populate('user', 'name');
};

const getBookRating = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: require('mongoose').Types.ObjectId.createFromHexString(bookId) } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  return stats[0] || { average: 0, count: 0 };
};

module.exports = { getBookReviews, getAllReviews, getMyReviews, createReview, getBookRating };
