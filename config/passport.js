var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var dbconfig = require('./config/db.js');
var connection = mysql.createConnection(dbconfig);

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

passport.use(new LocalStrategy({
	usernameField : "id",
	passwordField : "password",
	passReqToCallback : true // 인증 수행 함수 : HTTP request 를 그대로 전달할 것인지 여부를 결정
}, function (req, username, password, done) {
	connection.query('select * from `user` where `id` = ?', username, function(err,result){
		if(err){
			console.log('query.err : ' + err);
			return done(false,null);
		}else{
			if(result.length === 0){
				console.log('해당 id는 없는 id 입니다.');
				return done(false,null);
			}else{
				if(result[0].password != password){
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