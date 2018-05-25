//文件上传和处理中间件
var express = require('express');
var fs = require('fs');
var md5 = require('md5');
var multer = require('multer');
var path = require('path');
var jsonWrite = require('./jsonWrite');
let newData = {
    data:{},
    msg:'',
    code:0
};

var router = express.Router();


/**
 * 创建文件夹
 */
var createFolder = function(folder){
  try{
      fs.accessSync(folder); 
  }catch(e){
      fs.mkdirSync(folder);
  }  
};

/**
 * process.cwd()获取项目根目录地址，可以将上传的文件指定到静态文件目录下，然后再返回地址给前端页面，如：
 * var uploadPath = process.cwd()+'/public/uploads' 前端访问地址 http://localhost:3000/uploads/文件名
 **/

var uploadFolder = './src/client/static/uploads';
// var uploadFolder = process.cwd()+'/src/server/public/uploads';

createFolder(uploadFolder);

//自定义文件名
var storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹会自动创建。
  destination: function (req, file, cb) {
    cb(null, uploadFolder)
  }, 
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    // cb(null, file.fieldname + '-' + md5(file) + "." + fileFormat[fileFormat.length - 1]);
  }
});

var limits = {
  //在这里设置最多能上传多少个文件，那么就不用在下面upload.array('field1', 5)设置了
  files: 1, //一次只允许上传一个文件
  fieldSize: 2*1024*1024, //内存大小
  fileSize: 5*1024*1024  // 设置文件大小不能超过5*1024*1024(5M)
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

router.post('/api/singleUpload', upload.single('avatar'), function (request, response, next) {

// request.file 是 `avatar` 文件
// request.body 对象中是表单中提交的文本字段(如果有)

	var file = request.file;
	console.log(file)

  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);

  // 设置响应类型及编码
  response.set({
      'content-type': 'application/json; charset=utf-8'
  });

  jsonWrite(response, file);
})

router.post('/api/multiUpload', upload.array('photos', 9), function (request, response, next) {
// request.files 是 `photos` 文件数组
// request.body 对象中是表单中提交的文本字段(如果有)
	var files = request.files;
	console.log(files)
  // 设置响应类型及编码
  response.set({
      'content-type': 'application/json; charset=utf-8'
  });
  jsonWrite(response, files);
})
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
router.post('/cool-profile', cpUpload, function (req, res, next) {
// req.files 是一个对象 (String -> Array)，文件的字段名是其 key，文件数组是 key的值
//
// 如：
// req.files['avatar'][0] -> File
// req.files['gallery'] -> Array
//
// req.body 对象中是表单中提交的文本字段(如果有)
})

module.exports = router;