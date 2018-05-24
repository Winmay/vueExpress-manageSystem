//文件上传和处理中间件
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var app = express();

var storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹会自动创建。
  destination: function (req, file, cb) {
    cb(null, '../public/uploads')
  }, 
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});

var limits = {
  //在这里设置最多能上传多少个文件，那么就不用在下面upload.array('field1', 5)设置了
  files: 1, //一次只允许上传一个文件
  fieldSize: 2*1024*1024, //内存大小
  fileSize: 5*1024*1024  // 设置文件大小不能超过5*1024*1024
}

//添加配置文件到muler对象。
var upload = multer({
  storage: storage,
  limits: limits
});

/***
*	Multer在解析完请求体后，
*	会向Request对象中添加一个body对象
*	和一个file或files对象（上传多个文件时使用files对象 ）。
*	其中，body对象中包含所提交表单中的文本字段（如果有），
*	而file(或files)对象中包含通过表单上传的文件。
***/
app.post('/profile', upload.single('avatar'), function (req, res, next) {
// req.file 是 `avatar` 文件
// req.body 对象中是表单中提交的文本字段(如果有)
})

app.post('/photos/upload', upload.array('photos', 9), function (req, res, next) {
// req.files 是 `photos` 文件数组
// req.body 对象中是表单中提交的文本字段(如果有)
})
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
// req.files 是一个对象 (String -> Array)，文件的字段名是其 key，文件数组是 key的值
//
// 如：
// req.files['avatar'][0] -> File
// req.files['gallery'] -> Array
//
// req.body 对象中是表单中提交的文本字段(如果有)
})