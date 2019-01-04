var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var dbconfig = require('./config/db.js');
var connection = mysql.createConnection(dbconfig);
var bcrypt = require('bcrypt-nodejs');

// login 할 때에 session에 어떤 데이터를 저장할 것인지 정함 (저장할 데이터가 너무 많아지면 성능이 떨어질 수 있어 user의 id만 저장)
passport.serializeUser(function(user, done){
	done(null, user.id);
	console.log("passport.serializerUser( user.id ) : " + user.id);
});

// request 시에 session 에서 어떻게 user object 를 만들 것인지 정하는 부분.
passport.deserializeUser(function(user, done){
	done(null, user);
	console.log("passport.deserializeUser ( user ) : " + user);
});

passport.use('register', new LocalStrategy({
	usenameField : "id",
	passwordField : "password",
	passReqToCallback : true
}, function (req, username, password, done) {
	connection.query('select * from `user` where `id` = ?', username, function(err,result){
		if(err){
			console.log('register.query.err');
			console.log(err);
			return done(false, null);
		}else{
			if(result.length !== 0){
				console.log('이미 존재하는 ID입니다.');
				return done(false, null);
			}else{
				var i_id, i_password, i_name, i_birthday, i_gender, i_salt;
				i_id = username;
				// crypto.randomBytes(64, (err, buf) => {
				// crypto.pbkdf2(password, buf.toString('base64'), 103202, 64, 'sha512', (err, key) => {
				// console.log(key.toString('base64'));
				// 		i_password = key.toString('base64');
				// 		i_salt = buf.toString('base64');
				// });
				// });
				bcrypt.hash(password, null, null, function(err,hash){
					
				});
				i_name = req.body.name;
				i_birthday = req.body.date;
				i_gender = null;
				
				connection.query("insert into user (userCode, id, password, name, birthday, gender, salt) values (concat('U',(select lpad(count(*)+1,5,'0') from user u)),?,?,?,?,?,?)", i_id, i_password, i_name, i_birthday, i_gender, i_salt, function(err,result){
					if(err){
						console.log('register insert query error');
						console.log(err);
					}
				});
			}
		}
	});
}));

passport.use('login', new LocalStrategy({
	usernameField : "id",
	passwordField : "password",
	passReqToCallback : true // 인증 수행 함수 : HTTP request 를 그대로 전달할 것인지 여부를 결정
}, function (req, username, password, done) {
	connection.query('select * from `user` where `id` = ?', username, function(err,result){
		if(err){
			console.log('login query error');
			console.log(err);
			return done(false,null);
		}else{
			if(result.length === 0){
				console.log('해당 id는 없는 id 입니다.');
				return done(false,null);
			}else{
				var i_password;
				crypto.pbkdf2(password, result[0].salt.toString('base64'), 103202, 64, 'sha512', (err, key) => {
					i_password = key.toString('base64');
  				});
				if(result[0].password != i_password){
					console.log('비밀번호가 일치하지 않습니다.');
					return done(false,null);
				}else{
					console.log('로그인 성공!');
					return done(null, {
						id : result[0].id,
						name : result[0].name	
					});
				}
			}
		}
	});
}));