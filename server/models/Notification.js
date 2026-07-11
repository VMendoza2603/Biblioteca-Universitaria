const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
    },
    message: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      maxlength: 500,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
