"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
// Join entity
var BookAuthorSchema = new Schema({
    book_id: ObjectId,
    author_id: ObjectId,
});
exports.BookAuthor = mongoose.model('BookAuthor', BookAuthorSchema);
