const loanService = require('../services/loan.service');
const asyncHandler = require('../utils/asyncHandler');

const getMyLoans = asyncHandler(async (req, res) => {
  const result = await loanService.getMyLoans(req.user._id);
  res.json(result);
});

const getAllLoans = asyncHandler(async (req, res) => {
  const result = await loanService.getAllLoans();
  res.json(result);
});

const borrowBook = asyncHandler(async (req, res) => {
  const loan = await loanService.borrowBook(req.user._id, req.body.bookId);
  res.status(201).json(loan);
});

const returnBook = asyncHandler(async (req, res) => {
  const loan = await loanService.returnBook(req.user._id, req.params.id);
  res.json(loan);
});

module.exports = { getMyLoans, getAllLoans, borrowBook, returnBook };
