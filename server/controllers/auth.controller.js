const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.json(user);
});

module.exports = { register, login, getProfile };
