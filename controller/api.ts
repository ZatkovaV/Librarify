// import models

import * as B from '../model/book'
import * as A from '../model/author'
// import * as PR from 'request-promise'
// import * as p from 'request'



// offers methods to work with models
export class Api {
    private books: typeof B.Book;
    private authors: typeof A.Author;

    constructor() {
        this.books = B.Book;
        this.authors = A.Author;
    }


    // finds books according to id or name
    public findBooks(req, res) {

        // priority of searching according to book id is higher
        // that means if both name and id are submitted as params
        // book will by find according to id

        if (req.query.id) var query = this.books.findById(req.query.id).populate('authors');

        // find books according to name
        else if (req.query.name) var query = this.books.find({
            name: new RegExp("^.*" + req.query.name + ".*$", "i")
        }).populate('authors');

        // if no matching parameter is set
        else var query = this.books.find().populate('authors');

        query.exec(function (err, result) {
            if (err) res.send(JSON.stringify(err));
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({success: result}));
            }
        });
    }


    // ids - array of id's of authors, which are connected to a given book
    private addBookToAuthors(book, ids, res, callback?: (x) => void) {
        let author_ids = ids;

        // appends book_id to all concerned authors
        this.authors.update({_id: {$in: ids}}, { $push: {books: book._id} }, {multi: true}).exec()
            .then(() => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: book }));

                if (callback) callback(author_ids);
            })
            .catch((err) => {
                console.log(err);
            })
    }



    private createBook(author_names, req, res) {
        let ids = [];
        let self = this;

        // this query needs to return id's of books only

        this.authors.find({ 'name': { $in: author_names} }, {_id: 1}).exec()
        .then(async (result) => {

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
            await newBook.save();

            // return created book
            return newBook;
        })
        .then((newBook) => {
            self.addBookToAuthors(newBook, ids, res);
        });

    }



    // creates new book
    public addBook(req, res) {

        // when creating a new book, we also create authors - if they don't exist yet
        // currently, authors are
        let self = this;
        let author_names = req.body.author;
        let foo = [];


        for (let i = 0; i < author_names.length; i++) {
            foo.push({name: author_names[i]});
        }

        this.authors.insertMany(foo, {ordered: false}, function (err) {
            if (err) console.log(err);
            self.createBook(author_names, req, res)
        });




    }


    // delete a book according to id
    // remove book id from its authors' list of books
    public async deleteBook(req, res) {
        let id = req.params.id;

        // remove book itself
        await this.books.remove({ _id: id }).exec()
        .then(async () => {

            // remove book's id from all its authors
            await this.authors.update({books: id}, { $pull: {books: id} }, {multi: true}).exec()
        })
        .then(() => {
                res.send({
                    message: 'Object successfully deleted. ',
                    id: id
                });
        });
    }



    // update a book
    public updateBook(req, res) {
        this.books.findById(req.body.id, function (err, result) {
            if (err) res.send(JSON.stringify(err));
            else {
                result.name = req.body.name || result.name;
                result.desc = req.body.desc || result.desc;
                result.authors = req.body.authors || result.authors;

                result.save(function (err, rest) {
                    if (err) res.send(JSON.stringify(err));
                    else {
                        res.send({
                            message: 'Object was successfully updated.',
                            object: rest
                        })
                    }
                });
            }
        })
    }

}