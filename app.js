var express = require('express');
var app = express();
var mongoose = require('mongoose');
var api_int = require('./controller/api');

// Create db connection
mongoose.connect('mongodb://localhost/librarify');

var db = mongoose.connection;


db.on('error', console.error.bind(console, 'Could not connect:'));
db.once('open', function() {
    console.log('DB is on');

    // creates new instantion of Api class
    var api = new api_int.Api(db);

    app.get('/all', function (req, res) {
        api.getBooks(res);
    })
});


// root
app.get('/', function (req, res) {
    res.send('Still an empty project..');

});


app.listen(4343, function () {
    console.log('Librarify is listening on 4343');
});


