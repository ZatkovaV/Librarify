import * as mongoose from 'mongoose'

let Schema = mongoose.Schema;


// Author entity

var AuthorSchema = new Schema({
    name: String,  // Author name
    books: [{type: Schema.Types.ObjectId, ref: 'Book'}] // Books written by author
});


export var Author = mongoose.model('Author', AuthorSchema);
