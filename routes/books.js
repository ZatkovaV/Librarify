var express = require('express');
var router = express.Router();
var api_int = require('../controller/api');

var api = new api_int.Api();


// GET find books according to id or name
router.get('/', function (req, res) {
    api.findBooks(req, res);
});


// POST create new book
router.post('/', function (req, res) {
    api.addBook(req, res);
});


// PUT update book info
router.put('/', function (req, res) {
    api.updateBook(req, res);
})


// DELETE delete a book according to id
router.delete('/', function (req, res) {
    api.deleteBook(req, res);
});

module.exports = router;
