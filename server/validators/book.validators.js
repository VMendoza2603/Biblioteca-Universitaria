const { body } = require('express-validator');

const createBookValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio'),
  body('author')
    .trim()
    .notEmpty().withMessage('El autor es obligatorio'),
  body('isbn')
    .trim()
    .notEmpty().withMessage('El ISBN es obligatorio'),
  body('category')
    .notEmpty().withMessage('La categoría es obligatoria'),
  body('quantity')
    .isInt({ min: 0 }).withMessage('La cantidad debe ser un entero >= 0'),
  body('year')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Año inválido'),
  body('image')
    .optional()
    .isString(),
];

const updateBookValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('El título no puede estar vacío'),
  body('author')
    .optional()
    .trim()
    .notEmpty().withMessage('El autor no puede estar vacío'),
  body('isbn')
    .optional()
    .trim()
    .notEmpty().withMessage('El ISBN no puede estar vacío'),
  body('category')
    .optional()
    .notEmpty().withMessage('Categoría inválida'),
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('La cantidad debe ser un entero >= 0'),
  body('year')
    .optional()
    .isInt({ min: 1000 }).withMessage('Año inválido'),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('Estado inválido'),
];

module.exports = { createBookValidator, updateBookValidator };
