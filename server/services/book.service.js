const Book = require('../models/Book');
const AppError = require('../utils/AppError');

const getAll = async ({ page = 1, limit = 10, search, category }) => {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { isbn: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    Book.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Book.countDocuments(query),
  ]);

  return {
    books,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getById = async (id) => {
  const book = await Book.findById(id).populate('category', 'name');
  if (!book) {
    throw new AppError('Libro no encontrado', 404);
  }
  return book;
};

const create = async (data) => {
  const existingBook = await Book.findOne({ isbn: data.isbn });
  if (existingBook) {
    throw new AppError('El ISBN ya está registrado', 400);
  }

  const book = await Book.create(data);
  const populated = await Book.findById(book._id).populate('category', 'name');
  return populated;
};

const update = async (id, data) => {
  if (data.isbn) {
    const existing = await Book.findOne({ isbn: data.isbn, _id: { $ne: id } });
    if (existing) {
      throw new AppError('El ISBN ya está registrado por otro libro', 400);
    }
  }

  const book = await Book.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('category', 'name');

  if (!book) {
    throw new AppError('Libro no encontrado', 404);
  }
  return book;
};

const remove = async (id) => {
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    throw new AppError('Libro no encontrado', 404);
  }
  return book;
};

module.exports = { getAll, getById, create, update, remove };
