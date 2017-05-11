var express = require('express');
var app = express();
var mongoose = require('mongoose');

// Create db connection
mongoose.connect('mongodb://localhost/librarify');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Could not connect:'));
db.once('open', function() {
    // Obtain db models
    console.log('DB is on');
    var books = require('./model/book');
    var authors = require('./model/author');
    var book_authors = require('./model/bookauthor');

});


// root
app.get('/', function (req, res) {
    res.send('Still an empty project..');

});


app.listen(4343, function () {
    console.log('Librarify is listening on 4343');
});


