var express = require('express')
var app = express();

var PORT = process.env.PORT || 3000;

var server = app.listen(PORT, function(){
    console.log("SERVER START..");
});