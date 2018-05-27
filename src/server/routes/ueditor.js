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

var uploadFolder = './src/client/static/uploads';
// var uploadFolder = './dist/static/uploads';

//使用模块  
router.use("/api/ueditor", ueditor(uploadFolder, function (req, res, next) {  
    // ueditor 客户发起上传图片请求 
    // console.log('ueditor:'+JSON.parse(JSON.stringify(req.ueditor)))
    // var file = JSON.parse(JSON.stringify(req.ueditor));
    var imgDir = '/images/'
    var fileDir = '/file/'
    var videoDir = '/video/'
    let ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {

        let file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if(ActionType === 'uploadfile'){
            file_url = fileDir; //附件
        }
        if(ActionType === 'uploadvideo'){
            file_url = videoDir; //视频
        }

        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做  
        res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开  
    }  
    //  客户端发起图片列表请求  
    else if (ActionType === 'listimage') {  
        var dir_url = imgDir;  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片  
    }  
    //  客户端发起文件列表请求  
    else if (ActionType === 'listfile') {  
        var dir_url = fileDir;  
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有文件
    } 
    // 客户端发起其它请求  
    else {  
        // console.log('config.json')  
        res.setHeader('Content-Type', 'application/json');  
        res.redirect('/static/UE/php/config.json');

    }  
})); 

module.exports = router;