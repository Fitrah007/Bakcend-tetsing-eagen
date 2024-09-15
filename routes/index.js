// routes/index.js
const express = require('express');
const router = express.Router();
const BookController = require('../controllers/book');
const MemberController = require('../controllers/member');

// Routes for books
router.get('/books', BookController.index); // Get all books
router.get('/books/:code', BookController.show); // Get a book by code
// Routes for members
router.get('/members', MemberController.index); // Get all members
router.post('/members/borrow', MemberController.borrowBook); // Borrow a book
router.post('/members/return', MemberController.returnBook); // Return a book

module.exports = router;
