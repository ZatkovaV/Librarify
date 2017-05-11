"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Book entity
var BookSchema = new Schema({
    name: { type: String, index: true },
    desc: String,
    authors: [{ type: Schema.Types.ObjectId, ref: 'Author' }] // Book's authors
});
exports.Book = mongoose.model('Book', BookSchema);
