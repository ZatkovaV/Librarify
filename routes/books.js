var express = require('express');
var router = express.Router();
var api_int = require('../controller/api');

var api = new api_int.Api();

// GET all books
router.get('/all', function (req, res) {
    api.getBooks(res);
});


// POST create new book
router.post('/', function (req, res) {
    api.addBook(req, res);
});


// DELETE delete a book according to id
router.delete('/', function (req, res) {
    api.deleteBook(req, res);
});

module.exports = router;
