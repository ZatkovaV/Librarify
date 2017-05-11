"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import models
var B = require("../model/book");
// offers methods to work with models
var Api = (function () {
    function Api() {
        this.books = B.Book;
    }
    // finds books according to id or name
    Api.prototype.findBooks = function (req, res) {
        // priority of searching according to book id is higher
        // that means if both name and id are submitted as params
        // book will by find according to id
        if (req.param.id)
            var query = this.books.findById(req.param.id);
        else if (req.param('name'))
            var query = this.books.find({ name: new RegExp("^.*" + req.param('name') + ".*$", "i") });
        else
            var query = this.books.find();
        query.exec(function (err, result) {
            if (err)
                res.send(JSON.stringify(err));
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: result }));
            }
        });
    };
    // creates new book
    Api.prototype.addBook = function (req, res) {
        var newBook = new B.Book({ name: req.body.name, desc: req.body.desc });
        newBook.save(function (err, newBook) {
            if (err)
                res.send(JSON.stringify(err));
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: newBook }));
            }
        });
    };
    // delete a book according to id
    Api.prototype.deleteBook = function (req, res) {
        this.books.findByIdAndRemove(req.body.id, function (err, result) {
            if (err)
                res.send(JSON.stringify(err));
            else {
                res.send({
                    message: 'Object successfully deleted.',
                    id: result._id
                });
            }
        });
    };
    // update a book
    Api.prototype.updateBook = function (req, res) {
        this.books.findById(req.body.id, function (err, result) {
            if (err)
                res.send(JSON.stringify(err));
            else {
                result.name = req.body.name || result.name;
                result.desc = req.body.desc || result.desc;
                result.authors = req.body.authors || result.authors;
                result.save(function (err, rest) {
                    if (err)
                        res.send(JSON.stringify(err));
                    else {
                        res.send({
                            message: 'Object was successfully updated.',
                            object: rest
                        });
                    }
                });
            }
        });
    };
    return Api;
}());
exports.Api = Api;
