var express = require('express');
var router = express.Router();
var api_int = require('../controller/api');

var api = new api_int.Api();

// GET all books
router.get('/all', function (req, res) {
    api.getBooks(res);
});


// POST create new book
router.post('/add', function (req, res) {
    api.addBook(req, res);
});

module.exports = router;
