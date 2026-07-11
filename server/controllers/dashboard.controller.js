const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    const stats = await dashboardService.getAdminStats();
    return res.json(stats);
  }

  const stats = await dashboardService.getUserStats(req.user._id);
  res.json(stats);
});

module.exports = { getStats };
