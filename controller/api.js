"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import models
var B = require("../model/book");
// offers methods to work with models
var Api = (function () {
    function Api() {
        this.books = B.Book;
    }
    // returns all books
    Api.prototype.getBooks = function (res) {
        this.books.find({}).populate('Author').exec(function (err, result) {
            if (err)
                console.error(err);
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: result }));
            }
        });
    };
    // dopis potom, aby sa v pripade erroru vypisal error aj na endpointe
    // creates new book
    Api.prototype.addBook = function (req, res) {
        var newBook = new B.Book({ name: req.body.name, desc: req.body.desc });
        newBook.save(function (err, newBook) {
            if (err)
                console.error(err);
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: newBook }));
            }
        });
    };
    // deletes book
    Api.prototype.deleteBook = function (req, res) {
        this.books.findByIdAndRemove(req.body.id, function (err, result) {
            res.send({
                message: 'Object successfully deleted.',
                id: result._id
            });
        });
    };
    return Api;
}());
exports.Api = Api;
