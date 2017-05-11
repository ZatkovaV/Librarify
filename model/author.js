"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// Author entity
var AuthorSchema = new Schema({
    name: String,
});
exports.Author = mongoose.model('Author', AuthorSchema);
