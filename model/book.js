"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Book entity
var BookSchema = new Schema({
    name: { type: String, index: true },
    desc: String,
});
exports.Book = mongoose.model('Book', BookSchema);
