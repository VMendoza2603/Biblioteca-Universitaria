const Category = require('../models/Category');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');

const getAll = async () => {
  const categories = await Category.find().sort({ name: 1 });
  return { categories };
};

const getById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }
  return category;
};

const create = async (data) => {
  const category = await Category.create(data);
  return category;
};

const update = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }
  return category;
};

const remove = async (id) => {
  const booksUsingCategory = await Book.countDocuments({ category: id });
  if (booksUsingCategory > 0) {
    throw new AppError(
      `No se puede eliminar la categoría porque está siendo usada por ${booksUsingCategory} libro(s)`,
      400
    );
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new AppError('Categoría no encontrada', 404);
  }
  return category;
};

module.exports = { getAll, getById, create, update, remove };
