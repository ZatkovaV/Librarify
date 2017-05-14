var express = require('express');
var router = express.Router();

// root - GET home page
router.get('/', function(req, res) {
    res.send({
        message: "Librarify. Visit /help for manual."
    });
});

// GET help page with manual -- dat to do suboru mozno?
router.get('/help', function(req, res) {
    res.send({
        message: "This is manual."
    });
});


module.exports = router;