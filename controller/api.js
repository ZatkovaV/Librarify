"use strict";
// import models
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const B = require("../model/book");
const A = require("../model/author");
// import * as PR from 'request-promise'
// import Schema as p from 'request'
// offers methods to work with models
class Api {
    constructor() {
        this.tmpAuthors = [];
        this.books = B.Book;
        this.authors = A.Author;
    }
    // finds books according to id or name
    findBooks(req, res) {
        // priority of searching according to book id is higher
        // that means if both name and id are submitted as params
        // book will by find according to id
        if (req.query.id)
            var query = this.books.findById(req.query.id).populate('authors');
        else if (req.query.name)
            var query = this.books.find({
                name: new RegExp("^.*" + req.query.name + ".*$", "i")
            }).populate('authors');
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
    }
    // ids - array of id's of authors, which are connected to a given book
    addBookToAuthors(book, ids, res, callback) {
        let author_ids = ids;
        // appends book_id to all concerned authors
        this.authors.update({ _id: { $in: ids } }, { $push: { books: book._id } }, { multi: true }).exec()
            .then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ success: book }));
            if (callback)
                callback(author_ids);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    createBook(author_names, req, res) {
        let ids = [];
        let self = this;
        // this query needs to return id's of books only
        this.authors.find({ 'name': { $in: author_names } }, { _id: 1 }).exec()
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            // creates array of id's
            for (let i = 0; i < result.length; i++)
                ids.push(result[i]._id);
            // create new Book object
            let newBook = new B.Book({
                name: req.body.name,
                desc: req.body.desc,
                authors: ids
            });
            // save object to db
            // then add book's id to book's authors
            yield newBook.save();
            // return created book
            return newBook;
        }))
            .then((newBook) => {
            self.addBookToAuthors(newBook, ids, res);
        });
    }
    // creates new book
    addBook(req, res) {
        // when creating a new book, we also create authors - if they don't exist yet
        // currently, authors are
        let self = this;
        let author_names = req.body.author;
        let foo = [];
        for (let i = 0; i < author_names.length; i++) {
            foo.push({ name: author_names[i] });
        }
        this.authors.insertMany(foo, { ordered: false }, function (err) {
            if (err)
                console.log(err);
            self.createBook(author_names, req, res);
        });
    }
    // delete a book according to id
    // remove book id from its authors' list of books
    deleteBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            // remove book itself
            yield this.books.remove({ _id: id }).exec()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                // remove book's id from all its authors
                yield this.authors.update({ books: id }, { $pull: { books: id } }, { multi: true }).exec();
            }))
                .then(() => {
                res.send({
                    message: 'Object successfully deleted. ',
                    id: id
                });
            });
        });
    }
    updateBookAndAuthors(req, res, book_id, name, desc) {
        return __awaiter(this, void 0, void 0, function* () {
            // get id's of all current authors
            yield this.authors.find({ 'name': { $in: req.body.author } }, { _id: 1 }).exec()
                .then((authors) => {
                this.tmpAuthors = [];
                // creates array of id's
                for (let i = 0; i < authors.length; i++)
                    this.tmpAuthors.push(authors[i]._id);
            })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                // add book to its authors' list of books
                yield this.authors.update({ _id: { $in: this.tmpAuthors } }, { $push: { books: book_id } }, { multi: true }).exec();
            }))
                .then(() => {
                // and finally update book info
                this.books.update({ _id: book_id }, {
                    name: name,
                    desc: desc,
                    authors: this.tmpAuthors
                }, (err) => { res.send({ message: "Book successfully updated." }); });
            });
        });
    }
    // update a book
    updateBook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let book_id = req.params.id;
            // find the book first
            yield this.books.find({ _id: book_id }).exec()
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                // set basic book params to update
                // if params to update were not sent, keep current value
                let name = req.body.name || result.name;
                let desc = req.body.desc || result.desc;
                // if authors are supposed to be changed, change them first
                if (req.body.author) {
                    // remove book's id from all previous authors
                    yield this.authors.update({ books: book_id }, { $pull: { books: book_id } }, { multi: true }).exec()
                        .then(() => {
                        let newAthrs = [];
                        // prepare names of authors for being inserted in db
                        for (let i = 0; i < req.body.author.length; i++)
                            newAthrs.push({ name: req.body.author[i] });
                        return newAthrs;
                    })
                        .then((newAuthors) => {
                        // create new authors, if any
                        this.authors.insertMany(newAuthors, { ordered: false }, function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield self.updateBookAndAuthors(req, res, book_id, name, desc);
                            });
                        });
                    });
                }
                else {
                    this.books.update({ _id: book_id }, {
                        name: name,
                        desc: desc,
                    }, (err) => { res.send({ message: "Book successfully updated." }); });
                }
            }));
        });
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map