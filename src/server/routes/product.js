var express = require('express');
var sql = require('../config/sql');
var api = require('./api');
var jsonWrite = require('./jsonWrite');
let newData = {
    data:{},
    msg:'',
    code:0
};

var router = express.Router();

var param = 'contentId INT NOT NULL AUTO_INCREMENT COMMENT "商品 Id",'
    +'categoryId INT NOT NULL COMMENT "商品分类 Id, 对应 category 表的主键",'
    +'name VARCHAR(100) NOT NULL COMMENT "商品名字",'
    +'summary VARCHAR(1000) COMMENT "商品简介",'
    +'inventory INT(10) NOT NULL DEFAULT "0" COMMENT "商品库存",'
    +'marketPrice DECIMAL(10,2) NOT NULL DEFAULT "0" COMMENT "商品原价",'
    +'discountPrice DECIMAL(10,2) NOT NULL DEFAULT "0" COMMENT "商品折扣价",'
    +'status INT(6) NOT NULL DEFAULT "1" COMMENT "商品状态.1- 在售 2- 下架 3- 删除",'
    +'image VARCHAR(1000) NOT NULL COMMENT "商品封面图",'
    +'images TEXT NOT NULL COMMENT "商品轮播图",'
    +'introduction TEXT NOT NULL COMMENT "商品详细介绍",'
    +'createTime DATETIME DEFAULT NULL COMMENT "创建时间",'
    +'updateTime DATETIME DEFAULT NULL COMMENT "更新时间",'
    +'PRIMARY KEY ( contentId )'

sql.createTable('productTable' , param, '产品列表')

let checkData = function (data, response){
    if (data.name == '') {
        newData.msg = '请输入商品名称'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else if (data.categoryId == '') {
        newData.msg = '请选择商品分类'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else if (data.inventory == '') {
        newData.msg = '请输入商品库存'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else if (data.marketPrice == '') {
        newData.msg = '请输入商品市场价格'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else if (data.image == '') {
        newData.msg = '请上传封面图片'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else if (data.images == '') {
        newData.msg = '请至少上传一张图片'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else {
        newData.msg = ''
        newData.code = 0
        return true
    }
}

router.get(api.allProduct, function(request, response) {

    sql.fetchAllSqlData( 'productTable' ).then(results => {
        var newData = {
            data: {
                data: JSON.parse(JSON.stringify(results)),
                count: JSON.parse(JSON.stringify(results)).length
            },
            msg:'',
            code:0
        }
        jsonWrite(response, newData);
    })
    .catch(error => { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    });
});

router.get(api.getProduct, async function(request, response) {
    const urlModule = require('url');
    let params = urlModule.parse(request.url, true).query;//解析数据 获得Json对象
    let pageIndex = parseInt(params.pageIndex)
    let count = 0
    try {
        let countData = await sql.selectSqlData( 'productTable', 'count' )
        count = JSON.parse(JSON.stringify(countData[0]))['count( * )']

        let data = await sql.fetchPageSqlData( 'productTable', pageIndex, 10 )

        let newData = {
            data: {
                data: JSON.parse(JSON.stringify(data)),
                count: count
            },
            msg:'',
            code:0
        }
        jsonWrite(response, newData);
    } catch (error)  { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    }
});

router.post(api.modProduct, function(request, response) {
    let modData = request.body

    let isOk = checkData(addData, response)

    if (isOk) {
        sql.updateSqlData( 'productTable', modData, 'contentId='+modData['contentId']  ).then(results => {
            console.log(JSON.parse(JSON.stringify(results)))
            jsonWrite(response, newData);
        })
        .catch(error => { 
            console.log('caught', error.message);
            new Error('error: '+error.message) 
        });
    }
});

router.post(api.addProduct, function(request, response) {
    let addData = request.body

    let isOk = checkData(addData, response)

    if (isOk) {
        sql.insertSqlData( 'productTable', addData  ).then(results => {
            console.log(JSON.parse(JSON.stringify(results)))
            jsonWrite(response, newData);
        })
        .catch(error => { 
            console.log('caught', error.message);
            new Error('error: '+error.message) 
        });
    }
});

router.post(api.delProduct, function(request, response) {
    let contentId = request.body.contentId

    sql.deleteSqlData( 'productTable', 'contentId='+contentId  ).then(results => {
        console.log(JSON.parse(JSON.stringify(results)))
        jsonWrite(response, newData);
    })
    .catch(error => { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    });
});

module.exports = router;