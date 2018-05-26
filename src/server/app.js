require('../../build/check-versions')()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var logger = require('morgan');

var ueditor = require('ueditor');
var config = require('../../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)

var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
	? require('../../build/webpack.prod.conf')
	: require('../../build/webpack.dev.conf')

var indexRouter = require('./routes/index');
var Router = require('./routes/router');

var app = express();

// view engine setup 模板文件，根据具体情况添加
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var dir = __dirname
console.log(dir)
// app.use(express.static(path.join(dir.substring(0,dir.indexOf('server')), 'client\static')));  


//nodejs 解除跨域限制
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})


// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./src/client/static'))


app.use('/', indexRouter);
app.use('/', Router);
app.use("/api/ueditor", ueditor('./src/client/static', function (req, res, next) {
    //客户端上传文件设置
    console.log(req) 
    console.log('path:'+req.path)   
    console.log('ueditor:'+JSON.stringify(req.ueditor))
    console.log('body:'+JSON.stringify(req.body)) 
    console.log('query:'+JSON.stringify(req.query))
    var imgDir = '/img/ueditor/'
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/static/UE/php/config.json');
    }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
