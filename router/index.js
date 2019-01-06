var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req,res){
    if(req.isAuthenticated()){
        res.render('');
    }else{
        res.redirect('/login');
    }
});

router.get('/login', function(req,res){
    var fmsg = req.flash();
    if (fmsg.error) {
        var errMsg = fmsg.error[fmsg.error.length - 1];
        console.log(errMsg);
    }
    res.render('login', {
        errmsg: errMsg
    });
});

router.post('/login', passport.authenticate('login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));

router.get('/logout', function(req,res){
        req.logout();
        res.redirect('/');
});