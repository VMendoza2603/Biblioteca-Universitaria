const bookService = require('../services/book.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const result = await bookService.getAll(req.query);
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const book = await bookService.getById(req.params.id);
  res.json(book);
});

const create = asyncHandler(async (req, res) => {
  const book = await bookService.create(req.body);
  res.status(201).json(book);
});

const update = asyncHandler(async (req, res) => {
  const book = await bookService.update(req.params.id, req.body);
  res.json(book);
});

const remove = asyncHandler(async (req, res) => {
  await bookService.remove(req.params.id);
  res.json({ message: 'Libro eliminado correctamente' });
});

module.exports = { getAll, getById, create, update, remove };
