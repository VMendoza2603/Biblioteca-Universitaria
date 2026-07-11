const analyticsService = require('../services/analytics.service');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSummary();
  res.json(data);
});

const getRecentReviews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const reviews = await analyticsService.getRecentReviews(limit);
  res.json(reviews);
});

module.exports = { getSummary, getRecentReviews };
