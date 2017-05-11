var express = require('express');
var router = express.Router();

// root - GET home page
router.get('/', function(req, res) {
    res.send('Still an empty project..');
});

module.exports = router;