var express = require('express');
var router = express.Router();
var api_int = require('../controller/api');

var api = new api_int.Api();


// GET - search books
router.get('(/id/:_id)?(/name/:name)?(/desc/:desc)?(/author/:authors)?(/author_name/:author_name)?/', function (req, res) {
    api.findBooks(req, res);
});


// POST - create new book
router.post('/new', function (req, res) {
    api.addBook(req, res);
});


// PUT - update book info
router.put('/edit/:id', function (req, res) {
    api.updateBook(req, res);
});


// DELETE - delete a book according to id
router.delete('/delete/:id', function (req, res) {
    api.deleteBook(req, res);
});

module.exports = router;