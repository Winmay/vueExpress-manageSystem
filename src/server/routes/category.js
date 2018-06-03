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

var param = 'contentId INT NOT NULL AUTO_INCREMENT COMMENT "分类 Id",'
    +'name VARCHAR(100) NOT NULL COMMENT "分类名称",'
    +'productCount INT(10) NOT NULL DEFAULT "0" COMMENT "产品数",'
    +'createTime VARCHAR(20) DEFAULT NULL COMMENT "创建时间",'
    +'updateTime VARCHAR(20) DEFAULT NULL COMMENT "更新时间",'
    +'PRIMARY KEY ( contentId )'

sql.createTable('categoryTable' , param, '产品分类')

let checkData = function (data, response){
    if (data.name == '') {
        newData.msg = '请输入分类名称'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else {
        newData.msg = ''
        newData.code = 0
        return true
    }
}

router.get(api.getCategory, async function(request, response) {

    try {
        let productCountData = await sql.selectGroupSqlData( 'producttable', 'categoryId, count(categoryId) as count', 'categoryId' )
        let countData = JSON.parse(JSON.stringify(productCountData))
        console.log(countData)
        for (var i=0;i<countData.length;i++) {
            await sql.updateSqlData( 'categoryTable', {productCount: countData[i].count}, 'contentId='+countData[i].categoryId )
        }
        let data = await sql.fetchAllSqlData( 'categoryTable' )
        let count = JSON.parse(JSON.stringify(data)).length

        let result = JSON.parse(JSON.stringify(data))

        let newData = {
            data: {
                data: result,
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

router.post(api.modCategory, async function(request, response) {
    let modData = request.body

    let isOk = checkData(modData, response)

    if (isOk) {
        try {
            let data = await sql.updateSqlData( 'categoryTable', modData, 'contentId='+modData['contentId'] )
            console.log(JSON.parse(JSON.stringify(data)))
            jsonWrite(response, newData)
        } catch (error)  { 
            console.log('caught', error.message);
            new Error('error: '+error.message) 
        }
    }
});

router.post(api.addCategory, async function(request, response) {
    let addData = request.body

    let isOk = checkData(addData, response)

    if (isOk) {
        try {
            let data = await sql.insertSqlData( 'categoryTable', addData )
            console.log(JSON.parse(JSON.stringify(data)))
            jsonWrite(response, newData)
        } catch (error)  { 
            console.log('caught', error.message);
            new Error('error: '+error.message) 
        }
    }
});

router.post(api.delCategory, async function(request, response) {
    let contentId = request.body.contentId

    try {
        let data = await sql.deleteSqlData( 'categoryTable', 'contentId='+contentId )
        console.log(JSON.parse(JSON.stringify(data)))
        jsonWrite(response, newData)
    } catch (error)  { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    }
});

module.exports = router;