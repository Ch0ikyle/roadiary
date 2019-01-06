var passport = require('passport');
var localstrategy = require('passport-local').strategy;
var mysql = require('mysql');
var dbconfig = require('./config/db.js');
var connection = mysql.createconnection(dbconfig);
var bcrypt = require('bcrypt-nodejs');

// login 할 때에 session에 어떤 데이터를 저장할 것인지 정함 (저장할 데이터가 너무 많아지면 성능이 떨어질 수 있어 user의 id만 저장)
passport.serializeuser(function(user, done){
	done(null, user.id);
	console.log("passport.serializeruser( user.id ) : " + user.id);
});

// request 시에 session 에서 어떻게 user object 를 만들 것인지 정하는 부분.
passport.deserializeuser(function(user, done){
	done(null, user);
	console.log("passport.deserializeuser ( user ) : " + user);
});

passport.use('register', new localstrategy({
	usenamefield : "id",
	passwordfield : "password",
	passreqtocallback : true
}, function (req, username, password, done) {
	connection.query('select * from `user` where `id` = ?', username, function(err,result){
		if(err){
			console.log('register.query.err');
			console.log(err);
			return done(false, null);
		}else{
			if(result.length !== 0){
				console.log('이미 존재하는 id입니다.');
				return done(false, null);
			}else{
				var i_id, i_password, i_name, i_birthday, i_gender, i_salt;
				i_id = username;
				// crypto.randombytes(64, (err, buf) => {
				// crypto.pbkdf2(password, buf.tostring('base64'), 103202, 64, 'sha512', (err, key) => {
				// console.log(key.tostring('base64'));
				// 		i_password = key.tostring('base64');
				// 		i_salt = buf.tostring('base64');
				// });
				// });
				bcrypt.hash(password, null, null, function(err,hash){
					
				});
				i_name = req.body.name;
				i_birthday = req.body.date;
				i_gender = null;
				
				bcrypt.hash(i_pw, null, null, function(err, hash){
					var data = { id : i_id,
			    				 password : hash,
			    				 name : i_name,
			    				 birthday : i_birthday,
			    				 gender : i_gender};
					connection.query("insert into user (usercode, id, password, name, birthday, gender, salt) values (concat('u',(select lpad(count(*)+1,5,'0') from user u)),?,?,?,?,?,?)", data, function(err, rows){
						if(err){
						console.log(err);
						}
					});
				});
			}
		}
	});
}));

passport.use('login', new localstrategy({
	usernamefield : "id",
	passwordfield : "password",
	passreqtocallback : true // 인증 수행 함수 : http request 를 그대로 전달할 것인지 여부를 결정
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
				crypto.pbkdf2(password, result[0].salt.tostring('base64'), 103202, 64, 'sha512', (err, key) => {
					i_password = key.tostring('base64');
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