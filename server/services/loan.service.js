const Loan = require('../models/Loan');
const Book = require('../models/Book');
const AppError = require('../utils/AppError');

const getMyLoans = async (userId) => {
  const loans = await Loan.find({ user: userId })
    .populate('book', 'title author isbn image')
    .sort({ createdAt: -1 });
  return { loans };
};

const getAllLoans = async () => {
  const loans = await Loan.find()
    .populate('user', 'name email')
    .populate('book', 'title author isbn')
    .sort({ createdAt: -1 });
  return { loans };
};

const borrowBook = async (userId, bookId) => {
  const book = await Book.findById(bookId);
  if (!book) throw new AppError('Libro no encontrado', 404);
  if (!book.isAvailable) throw new AppError('El libro no está disponible', 400);
  if (book.quantity < 1) throw new AppError('No hay ejemplares disponibles', 400);

  const activeLoan = await Loan.findOne({ user: userId, book: bookId, status: 'active' });
  if (activeLoan) throw new AppError('Ya tienes un préstamo activo de este libro', 400);

  const loan = await Loan.create({ user: userId, book: bookId });

  await Book.findByIdAndUpdate(bookId, { $inc: { quantity: -1 } });
  if (book.quantity - 1 <= 0) {
    await Book.findByIdAndUpdate(bookId, { isAvailable: false });
  }

  return loan.populate('book', 'title author image');
};

const returnBook = async (userId, loanId) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw new AppError('Préstamo no encontrado', 404);
  if (loan.user.toString() !== userId.toString()) throw new AppError('Este préstamo no te pertenece', 403);
  if (loan.status === 'returned') throw new AppError('El libro ya fue devuelto', 400);

  loan.status = 'returned';
  loan.returnDate = new Date();
  await loan.save();

  await Book.findByIdAndUpdate(loan.book, { $inc: { quantity: 1 }, isAvailable: true });

  return loan.populate('book', 'title author image');
};

module.exports = { getMyLoans, getAllLoans, borrowBook, returnBook };
