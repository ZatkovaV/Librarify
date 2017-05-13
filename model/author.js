"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
// Author entity
var AuthorSchema = new Schema({
    name: { type: String, unique: true },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }] // Books written by author
});
exports.Author = mongoose.model('Author', AuthorSchema);
//# sourceMappingURL=author.js.map