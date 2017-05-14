var express = require('express');
var router = express.Router();

// root - GET home page
router.get('/', function(req, res) {
    res.send({
        message: "Librarify.  Visit https://github.com/ZatkovaV/Librarify for help."
    });
});


module.exports = router;