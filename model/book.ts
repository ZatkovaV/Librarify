import * as mongoose from 'mongoose'

let Schema = mongoose.Schema;


// Book entity

var BookSchema = new Schema({
    name    : { type: String, index: true},  // Book name
    desc    : String,  // Description
    authors : [{type: Schema.Types.ObjectId, ref: 'Author'}] // Book's authors
});


export var Book = mongoose.model('Book', BookSchema);

