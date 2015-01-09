var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/app/index.html");
})

app.use("/static", express.static(__dirname + "/app/static"));

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})