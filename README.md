# Librarify

A simple REST-ful API node.js server for managing collection of books. 


## Getting started

### Prerequisites

```
node.js server with modules:
    "body-parser": "^1.17.1",
    "express": "^4.15.2",
    "mongodb": "^2.2.26",
    "mongoose": "^4.9.8",
    "typescript": "^2.3.2"

```


### Instalation

##### With npm
Simply clone or download project and run <i> npm install . </i> command in your enviroment.

##### Without npm
Download source of requested modules from github and include the main files in project using package.json.


## Built with
Librarify was built with:
* [TypeScript](https://www.typescriptlang.org/)
* [Express](https://expressjs.com/) - Flexible Node.js web application framework. 
* [MongoDB](https://www.mongodb.com/) - Document database
* [Mongoose](http://mongoosejs.com/) - MongoDb object modeling for node.js


## API reference
Librarify supports standard CRUD operations (with requests examples):

##### Create

```
curl -X POST --data "name=NAME&desc=DESC&author[]=AUTHOR1&author[]=AUTHOR2" http://server:port/books/new

```
If a param is not given, default null value will be assigned.
Array of authors can contain as many authors as you wish. 
Authors are unique, so if one of more of given authors have already been created before, their id is assigned to new book. Otherwise they are created first.

##### Read
```
curl -i -H "Accept: application/json" http://server:port/books/id/545766544/name/some_name/desc/description/author/554545456456/author_name/some_author_name
```
Optional parameters are:
* id - id of book
* name - name of book
* desc - description of book
* author - id of author
* author_name - name of author

If no params are given, all documents are returned.

##### Update
```
curl -X PUT --data "name=NAME&desc=DESCRIPTON&author[]=AUTHOR1&AUTHOR=AUTHOR2" http://server:port/books/edit/59174984084ace2ee8ddc531

```
Optional parameters are:
* name - new name of book
* desc - new description of book
* author - updated array of names of book's authors

Mandatory parameters are:
* book_id - id of updated book

##### Delete
```
curl -X DELETE http://server:port/books/delete/591706185c0c8b11fa6fc616

```
Mandatory parameters are:
* book_id - if of book to be removed

## Authors
* <b>Veronika Zatkova</b>

## License


