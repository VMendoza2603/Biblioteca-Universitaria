const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'El libro es obligatorio'],
    },
    rating: {
      type: Number,
      required: [true, 'La calificación es obligatoria'],
      min: [1, 'Mínimo 1 estrella'],
      max: [5, 'Máximo 5 estrellas'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'El comentario no puede exceder 500 caracteres'],
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reviewSchema.index({ user: 1, book: 1 }, { unique: true });
reviewSchema.index({ book: 1 });

module.exports = mongoose.model('Review', reviewSchema);
