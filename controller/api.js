"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import models
var B = require("../model/book");
var A = require("../model/author");
// offers methods to work with models
var Api = (function () {
    function Api() {
        this.books = B.Book;
        this.authors = A.Author;
    }
    // finds books according to id or name
    Api.prototype.findBooks = function (req, res) {
        // priority of searching according to book id is higher
        // that means if both name and id are submitted as params
        // book will by find according to id
        if (req.query.id)
            var query = this.books.findById(req.query.id).populate('authors');
        else if (req.query.name)
            var query = this.books.find({ name: new RegExp("^.*" + req.query.name + ".*$", "i") }).populate('authors');
        else
            var query = this.books.find().populate('authors');
        query.exec(function (err, result) {
            if (err)
                res.send(JSON.stringify(err));
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: result }));
            }
        });
    };
    // ids - array of id's of authors, which are connected to a given book
    Api.prototype.addBookToAuthors = function (book, ids, res) {
        // appends book_id to all concerned authors
        this.authors.updateMany({ _id: { $in: ids } }, { $push: { books: book._id } }, function (err, result) {
            if (err)
                res.send(err);
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: book }));
            }
        });
    };
    Api.prototype.createBook = function (author_names, req, res) {
        var ids = [];
        var self = this;
        // this query needs to return id's of books only
        this.authors.find({ 'name': { $in: author_names } }, { _id: 1 }, function (err, result) {
            for (var i = 0; i < result.length; i++) {
                ids.push(result[i]._id);
            }
            var newBook = new B.Book({ name: req.body.name, desc: req.body.desc, authors: ids });
            // save object to db
            newBook.save(function (err, newBook) {
                if (err)
                    res.send(console.log(err));
                else {
                    // if creating a book was successful, add book's id to all its authors
                    self.addBookToAuthors(newBook, ids, res);
                }
            });
        });
    };
    // creates new book
    Api.prototype.addBook = function (req, res) {
        // when creating a new book, we also create authors - if they don't exist yet
        // currently, authors are
        var foo = [];
        var author_names = req.body.author;
        var self = this;
        for (var i = 0; i < author_names.length; i++) {
            foo.push({ name: author_names[i] });
        }
        this.authors.insertMany(foo, { ordered: false }, function (err, r) {
            if (err) {
                console.log(err);
            }
            self.createBook(author_names, req, res);
        });
    };
    // delete a book according to id
    // remove book id from its authors' list of books
    Api.prototype.deleteBook = function (req, res) {
        var self = this;
        this.books.findByIdAndRemove(req.body.id, function (err, result) {
            if (err)
                res.send(JSON.stringify(err));
            else {
                // also remove book's id in authors' list of books
                self.authors.updateMany({ _id: { $in: result.authors } }, { $pull: { books: result._id } }, function (err) {
                    if (err)
                        console.log(err);
                    else {
                        res.send({
                            message: 'Object successfully deleted. ',
                            id: result._id
                        });
                    }
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
