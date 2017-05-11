// import models
import * as B from '../model/book'

// offers methods to work with models
export class Api {
    private books: typeof B.Book;


    // TO_DO potrebujem si ja vobec posielat to db?
    constructor() {
        this.books = B.Book;
    }


    // returns all books
    public getBooks(res) {
        this.books.find({}).populate('Author').exec(function (err, result) {
           if (err) console.error(err);
           else {
               res.setHeader('Content-Type', 'application/json');
               res.send(JSON.stringify({success: result}));
           }
        });
    }

    // dopis potom, aby sa v priapde erroru vypisal error aj na endpointe

    // creates new book
    public addBook(req, res) {
        let newBook = new B.Book({ name: req.body.name, desc: req.body.desc });

        newBook.save(function (err, newBook) {
            if (err) console.error(err);
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ sucess: newBook }));
            }
        });
    }

}