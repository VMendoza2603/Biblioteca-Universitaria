const mongoose = require('mongoose');
const Review = require('../models/Review');
const Book = require('../models/Book');
const Category = require('../models/Category');

const getSummary = async () => {
  const [ratingStats, reviewsWithBookCategory] = await Promise.all([
    Review.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]),
    Review.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'book',
          foreignField: '_id',
          as: 'bookData',
        },
      },
      { $unwind: '$bookData' },
      {
        $lookup: {
          from: 'categories',
          localField: 'bookData.category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
    ]),
  ]);

  const booksWithReviews = await Review.distinct('book');

  const avgByCategory = await Review.aggregate([
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'bookData',
      },
    },
    { $unwind: '$bookData' },
    {
      $lookup: {
        from: 'categories',
        localField: 'bookData.category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$categoryData._id',
        categoryName: { $first: '$categoryData.name' },
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
    { $sort: { average: -1 } },
  ]);

  const starDistribution = await Review.aggregate([
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  const topRated = await Review.aggregate([
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'bookData',
      },
    },
    { $unwind: '$bookData' },
    {
      $lookup: {
        from: 'categories',
        localField: 'bookData.category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$bookData._id',
        title: { $first: '$bookData.title' },
        author: { $first: '$bookData.author' },
        image: { $first: '$bookData.image' },
        categoryName: { $first: '$categoryData.name' },
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
    { $sort: { average: -1, count: -1 } },
    { $limit: 5 },
  ]);

  const worstRated = await Review.aggregate([
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'bookData',
      },
    },
    { $unwind: '$bookData' },
    {
      $lookup: {
        from: 'categories',
        localField: 'bookData.category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: '$bookData._id',
        title: { $first: '$bookData.title' },
        author: { $first: '$bookData.author' },
        image: { $first: '$bookData.image' },
        categoryName: { $first: '$categoryData.name' },
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
    { $sort: { average: 1, count: -1 } },
    { $limit: 5 },
  ]);

  const avgByBook = await Review.aggregate([
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'bookData',
      },
    },
    { $unwind: '$bookData' },
    {
      $group: {
        _id: '$bookData._id',
        title: { $first: '$bookData.title' },
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
    { $sort: { average: -1 } },
  ]);

  const allReviews = await Review.find()
    .populate('user', 'name email')
    .populate({ path: 'book', populate: { path: 'category', select: 'name' } })
    .sort({ createdAt: -1 });

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  starDistribution.forEach((s) => {
    distribution[s._id] = s.count;
  });

  return {
    summary: {
      average: ratingStats[0]?.average || 0,
      totalReviews: ratingStats[0]?.totalReviews || 0,
      booksWithReviews: booksWithReviews.length,
      avgByCategory,
    },
    avgByBook,
    starDistribution: distribution,
    topRated,
    worstRated,
    allReviews,
  };
};

const getRecentReviews = async (limit = 3) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate({ path: 'book', select: 'title author image', populate: { path: 'category', select: 'name' } })
    .sort({ createdAt: -1 })
    .limit(limit);
  return reviews;
};

module.exports = { getSummary, getRecentReviews };
