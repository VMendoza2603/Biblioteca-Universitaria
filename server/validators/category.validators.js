const { body } = require('express-validator');

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
];

const updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Máximo 200 caracteres'),
];

module.exports = { createCategoryValidator, updateCategoryValidator };
