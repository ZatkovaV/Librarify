import * as mongoose from 'mongoose'

let Schema = mongoose.Schema;


// Author entity

var AuthorSchema = new Schema({
    name    : String,  // Author name
});


export var Author = mongoose.model('Author', AuthorSchema);
