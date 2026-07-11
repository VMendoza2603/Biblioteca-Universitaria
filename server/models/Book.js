const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [1, 'El título debe tener al menos 1 carácter'],
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    author: {
      type: String,
      required: [true, 'El autor es obligatorio'],
      trim: true,
      minlength: [2, 'El autor debe tener al menos 2 caracteres'],
      maxlength: [100, 'El autor no puede exceder 100 caracteres'],
    },
    isbn: {
      type: String,
      required: [true, 'El ISBN es obligatorio'],
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es obligatoria'],
    },
    publisher: {
      type: String,
      trim: true,
      maxlength: [100, 'La editorial no puede exceder 100 caracteres'],
      default: '',
    },
    year: {
      type: Number,
      min: [1000, 'Año inválido'],
      max: [new Date().getFullYear(), 'El año no puede ser futuro'],
      default: new Date().getFullYear(),
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'La cantidad no puede ser negativa'],
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.index({ title: 'text', author: 'text', isbn: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Book', bookSchema);
