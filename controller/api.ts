// import models
import * as B from '../model/book'

// offers methods to work with models
export class Api {
    private db: object;
    private books: typeof B.Book;


    // TO_DO potrebujem si ja vobec posielat to db?
    constructor(db_object: object) {
        this.db = db_object;
        this.books = B.Book;
    }


    // returns all books
    public getBooks(res) {
        this.books.find({}, function (err, result) {
           if (err) console.error(err);
           else {
               res.setHeader('Content-Type', 'application/json');
               res.send(JSON.stringify({success: result}));
           }
        });
    }

}