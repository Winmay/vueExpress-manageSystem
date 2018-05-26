//加载ueditor 模块  
var ueditor = require("ueditor");
var express = require('express');
var router = express.Router();
var path = require('path');
var jsonWrite = require('./jsonWrite');
let newData = {
    data:{},
    msg:'',
    code:0
};

var uploadFolder = './src/client/static';
var dir = __dirname
console.log(__dirname)
console.log(dir.substring(0,(dir.indexOf('routes')-1)))
  
//使用模块  
router.use("/api/ueditor", ueditor('', function (req, res, next) {  
    // ueditor 客户发起上传图片请求 
    console.log('path:'+req.path)   
    console.log('body:'+JSON.stringify(req.body)) 
    console.log('query:'+JSON.stringify(req.query))
    console.log('ueditor:'+JSON.parse(JSON.stringify(req.ueditor)))
    var file = JSON.parse(JSON.stringify(req.ueditor));
    let ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {

        let file_url = '/images/ueditor/';//默认图片上传地址
        /*其他上传格式的地址*/
        if(ActionType === 'uploadfile'){
            file_url = '/file/ueditor/'; //附件
        }
        if(ActionType === 'uploadvideo'){
            file_url = '/video/ueditor/'; //视频
        }

        // var imgname = req.ueditor.filename;  
 
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做  
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开  

        jsonWrite(res, file);
    }  
    //  客户端发起图片列表请求  
    else if (ActionType === 'listimage') {  
        var dir_url = '/images/ueditor/';  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片  

        jsonWrite(res, file);
    }  
    //  客户端发起文件列表请求  
    else if (ActionType === 'listfile') {  
        var dir_url = '/file/ueditor/';  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有文件

        jsonWrite(res, file);
    } 
    // 客户端发起其它请求  
    else {  
        // console.log('config.json')  
        res.setHeader('Content-Type', 'application/json');  
        res.redirect('/static/UE/php/config.json');

        // jsonWrite(res, newData);
    }  
})); 

module.exports = router;