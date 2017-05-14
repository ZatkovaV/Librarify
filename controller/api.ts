// import models

import * as B from '../model/book'
import * as A from '../model/author'
import * as S from 'mongoose'


// offers CRUD methods to work with models
export class Api {
    private books: typeof B.Book;
    private authors: typeof A.Author;
    private tmpAuthors: Array<S.Schema.Types.ObjectId> = [];


    constructor() {
        this.books = B.Book;
        this.authors = A.Author;
    }


    // finds books according to id or name
    public findBooks(req, res) {

        var query, author_name;

        // object contaning all conditions to be applied while searching docs
        var cond = req.params;

        // array of allowed params
        var allowed = ['_id', 'name', 'desc', 'authors'];

        if (req.params.author_name)
            author_name = req.params.author_name;


        for (let item in req.params)
            // if param is not allowed or missing, remove it from conditions
            if ((allowed.indexOf(item) == -1) || (!cond[item]))
                delete cond[item];


        query = this.books.find(cond).populate({
            path: 'authors',
            select: '_id name books'
        });

        query.exec()
            .then((result) => {
                // if author_name was selected, filter results
                if (author_name)
                    result = result.filter((item) => {
                        for (let i = 0; i < item.authors.length; i++)
                            // return only books that contain author with given name
                            if (item.authors[i].name == author_name[0]) return true;

                        return false;
                    });

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({success: result}));
            })
            .catch((err) => {res.send({ message: "An error occured." })});
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


    private async updateBookAndAuthors(req, res, book_id, name, desc) {

        // get id's of all current authors
        await this.authors.find({ 'name': { $in: req.body.author} }, {_id: 1}).exec()
            .then((authors) => {
                this.tmpAuthors = [];

                // creates array of id's
                for (let i = 0; i < authors.length; i++)
                    this.tmpAuthors.push(authors[i]._id);
            })
            .then(async () => {

                // add book to its authors' list of books
                await this.authors.update({_id: {$in: this.tmpAuthors}},
                    { $push: {books: book_id} }, {multi: true}).exec();
            })
            .then(() => {
                // and finally update book info
                this.books.update({_id: book_id}, {
                    name: name,
                    desc: desc,
                    authors: this.tmpAuthors
                }, (err) => {res.send({message: "Book successfully updated."})});
            });
    }



    // update a book
    public async updateBook(req, res) {
        let self = this;
        let book_id = req.params.id;

        // find the book first
        await this.books.findOne({_id: book_id}).exec()
        .then(async (result) => {
            // set basic book params to update
            // if params to update were not sent, keep current value
            let name = req.body.name || result.name;
            let desc = req.body.desc || result.desc;

            // if authors are supposed to be changed, change them first
            if (req.body.author) {

                // remove book's id from all previous authors
                await this.authors.update({books: book_id},
                    { $pull: {books: book_id} }, {multi: true}).exec()
                    .then (() => {

                        let newAthrs = [];

                        // prepare names of authors for being inserted in db
                        for (let i = 0; i < req.body.author.length; i++)
                            newAthrs.push({name: req.body.author[i]});

                        return newAthrs;
                    })
                    .then((newAuthors) => {

                        // create new authors, if any
                        this.authors.insertMany(newAuthors, {ordered: false}, async function () {
                            await self.updateBookAndAuthors(req, res, book_id, name, desc);
                        });
                    });
            }

            // if no authors needed to be updated
            else {
                this.books.update({_id: book_id}, {
                    name: name,
                    desc: desc,
                }, (err) => { res.send({message: "Book successfully updated."}); });
            }
        });

    }

}