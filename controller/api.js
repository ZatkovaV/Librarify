"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import models
var B = require("../model/book");
// offers methods to work with models
var Api = (function () {
    // TO_DO potrebujem si ja vobec posielat to db?
    function Api(db_object) {
        this.db = db_object;
        this.books = B.Book;
    }
    // returns all books
    Api.prototype.getBooks = function (res) {
        this.books.find({}, function (err, result) {
            if (err)
                console.error(err);
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ success: result }));
            }
        });
    };
    return Api;
}());
exports.Api = Api;
