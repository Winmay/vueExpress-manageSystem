var express = require('express');
var sql = require('../config/sql');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var User = require('../model/loginModel');
var {loginIn} = require('./api');

var router = express.Router();

router.post(loginIn, function(req, res) {
	var userName = 'qq';
	var userPwd = '123';
	// var userName = req.body['txtUserName'];
	// var userPwd = req.body['txtUserPwd'];
	// var isRem = req.body['chbRem'];
	var md5 = crypto.createHash('md5');

	User.getUserByUserName(userName, function (sresults) {                            
        
        if(results == '')
        {
            res.locals.error = '用户不存在';
            return;
        }

        userPwd = md5.update(userPwd).digest('hex');
        //检查数据库里的加盐密码和用户输入的密码是否匹配,user.password为数据库里存储的密码
        bcrypt.compare(userPwd, results[0].userPass,function(err,res){
           var pwdMatchFlag = res;
           tryLogin(pwdMatchFlag);
           console.log(pwdMatchFlag);
        })
        // 尝试登录
        function tryLogin(pwdMatchFlag){
            if(pwdMatchFlag){
                /*if(isRem)
                {
                    res.cookie('islogin', userName, { maxAge: 60000 });                 
                }*/

                res.locals.username = userName;
                req.session.username = res.locals.username;  
                console.log(req.session.username);                        
                res.redirect('/');
                return;   //匹配成功跳转到主页
            }else{
                res.locals.error = '用户名或密码有误';
                console.log(1);
                return;  //匹配失败返回之前的页面
            }
        }    
    }); 
});

module.exports = router;