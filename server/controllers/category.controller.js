const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await categoryService.getAll();
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  res.json(category);
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  res.status(201).json(category);
});

const update = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  res.json(category);
});

const remove = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id);
  res.json({ message: 'Categoría eliminada correctamente' });
});

module.exports = { getAll, getById, create, update, remove };
