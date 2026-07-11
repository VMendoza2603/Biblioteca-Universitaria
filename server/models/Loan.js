const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
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
    loanDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'returned'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

loanSchema.index({ user: 1, status: 1 });
loanSchema.index({ book: 1, status: 1 });

module.exports = mongoose.model('Loan', loanSchema);
