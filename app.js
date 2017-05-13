var express = require('express');
var app =  express();
var mongoose = require('mongoose');
var api_int = require('./controller/api');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var books = require('./routes/books');


mongoose.Promise = global.Promise;

// Create db connection
mongoose.connect('mongodb://localhost/librarify');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Could not connect:'));
db.once('open', function() {
    console.log('DB is on');

    // if connection is open, access db model
    app.use('/books', books);
});


app.use('/', index);

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));


app.listen(4343, function () {
    console.log('Librarify is listening on 4343');
});

