const Book = require('../models/Book');
const Category = require('../models/Category');
const User = require('../models/User');
const Review = require('../models/Review');
const Loan = require('../models/Loan');

const getAdminStats = async () => {
  const [totalBooks, availableBooks, unavailableBooks, totalCategories, totalUsers, reviewStats, recentReviews] =
    await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ isAvailable: true }),
      Book.countDocuments({ isAvailable: false }),
      Category.countDocuments(),
      User.countDocuments(),
      Review.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
      Review.find()
        .populate('user', 'name')
        .populate('book', 'title')
        .sort({ createdAt: -1 })
        .limit(3),
    ]);

  return {
    totalBooks,
    availableBooks,
    unavailableBooks,
    totalCategories,
    totalUsers,
    ratings: {
      average: reviewStats[0]?.averageRating || 0,
      totalReviews: reviewStats[0]?.totalReviews || 0,
    },
    recentReviews,
  };
};

const getUserStats = async (userId) => {
  const [totalBooks, availableBooks, unavailableBooks, totalCategories, myLoans, myReviews] =
    await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ isAvailable: true }),
      Book.countDocuments({ isAvailable: false }),
      Category.countDocuments(),
      Loan.find({ user: userId }).populate('book', 'title author image').sort({ createdAt: -1 }),
      Review.find({ user: userId }).populate('book', 'title author image').sort({ createdAt: -1 }),
    ]);

  return {
    totalBooks,
    availableBooks,
    unavailableBooks,
    totalCategories,
    myLoans,
    myReviews,
  };
};

module.exports = { getAdminStats, getUserStats };
