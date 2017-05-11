import * as mongoose from 'mongoose'

let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


// Join entity

var BookAuthorSchema = new Schema({
    book_id    : ObjectId,  // Foreign key to book
    author_id  : ObjectId,  // Foreign key to author
});


export var BookAuthor = mongoose.model('BookAuthor', BookAuthorSchema);