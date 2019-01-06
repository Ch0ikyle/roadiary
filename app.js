var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var flash = require('connect-flash'); 
var passport = requier('./config/passport.js');
var dbconfig = require('./config/db.js');
var app = express();

var PORT = process.env.PORT || 3000;

app.set('views', __dirname + '/views'); //html 파일의 위치 정의
app.set('view engine', 'ejs'); // html 을 렌더링 할 때 ejs 엔진을 사용하도록 함.
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
	secret : "#$#@KYLE@#$#", //쿠키 변조 방지 값
	resave : false, // 
	saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());

var index = require('./router/index.js');
app.use('/',index);

var server = app.listen(PORT, function(){
    console.log("SERVER START..");
});