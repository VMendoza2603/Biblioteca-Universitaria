const reviewService = require('../services/review.service');
const asyncHandler = require('../utils/asyncHandler');

const getBookReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getBookReviews(req.params.bookId);
  res.json(result);
});

const getAllReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getAllReviews();
  res.json(result);
});

const getMyReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getMyReviews(req.user._id);
  res.json(result);
});

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  res.status(201).json(review);
});

const getBookRating = asyncHandler(async (req, res) => {
  const result = await reviewService.getBookRating(req.params.bookId);
  res.json(result);
});

module.exports = { getBookReviews, getAllReviews, getMyReviews, createReview, getBookRating };
