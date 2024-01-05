const express = require('express');
const mainController = require('../controllers/main');
const validateLoginForm = require('../middlewares/validationMiddleware');
const router = express.Router();
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', guestMiddleware, mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login', guestMiddleware, mainController.login);
router.post('/users/login',validateLoginForm, mainController.processLogin);
router.get('/logout', authMiddleware, mainController.logout);
router.delete('/book/delete/:id', mainController.deleteBook);
router.get('/books/edit/:id', adminMiddleware,mainController.edit);
router.put('/books/edit/:id', mainController.processEdit);

module.exports = router;
