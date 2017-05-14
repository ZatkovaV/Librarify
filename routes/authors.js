var express = require('express');
var router = express.Router();
var api_int = require('../controller/api');

var api = new api_int.Api();


// GET - search authors
router.get('(/id/:_id)?(/name/:name)?(/book/:books)?/', function (req, res) {
    api.findAuthors(req, res);
});


module.exports = router;