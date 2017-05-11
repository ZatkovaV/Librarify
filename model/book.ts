import * as mongoose from 'mongoose'

let Schema = mongoose.Schema;


// Book entity

var BookSchema = new Schema({
    name: { type: String, index: true},  // Book name
    desc    : String,  // Description
});


export var Book = mongoose.model('Book', BookSchema);

