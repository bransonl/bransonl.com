var express = require("express");
var app = express();

app.listen(8000);

app.use("/", express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});