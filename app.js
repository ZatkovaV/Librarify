var express = require('express')
var app = express()


app.get('/', function (req, res) {
    res.send('Still an empty project..')
})


app.listen(4343, function () {
    console.log('Librarify is listening on 4343')
})

