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

var param = 'contentId INT NOT NULL AUTO_INCREMENT,'
    +'name VARCHAR(100) NOT NULL,'
    +'date VARCHAR(100) NOT NULL,'
    +'address VARCHAR(100) NOT NULL,'
    +'PRIMARY KEY ( contentId )'

sql.createTable('vueTable' , param)

let checkData = function (data, response){
    console.log(data)
    if (data.name == '') {
        newData.msg = '请填写姓名'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else if (data.date == '') {
        newData.msg = '请填写日期'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    } else if (data.address == '')  {
        newData.msg = '请填写地址'
        newData.code = 10001
        jsonWrite(response, newData);
        return false
    }else {
        newData.msg = ''
        newData.code = 0
        return true
    }
}

router.get(api.list, function(request, response) {

    sql.fetchAllSqlData( 'vueTable' ).then(results => {
        var newData = {
            data: JSON.parse(JSON.stringify(results)),
            count: JSON.parse(JSON.stringify(results)).length
        }
        jsonWrite(response, newData);
    })
    .catch(error => { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    });
});

router.get(api.getList, async function(request, response) {
    const urlModule = require('url');
    let params = urlModule.parse(request.url, true).query;//解析数据 获得Json对象
    let pageIndex = parseInt(params.pageIndex)
    let count = 0
    try {
        let countData = await sql.selectSqlData( 'vueTable', 'count' )
        count = JSON.parse(JSON.stringify(countData[0]))['count']

        let data = await sql.fetchPageSqlData( 'vueTable', pageIndex, 10 )

        let newData = {
            data: JSON.parse(JSON.stringify(data)),
            count: count
        }
        jsonWrite(response, newData);
    } catch (error)  { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    }
});

router.post(api.modList, function(request, response) {
    let modData = request.body

    sql.updateSqlData( 'vueTable', modData, 'contentId='+modData['contentId']  ).then(results => {
        console.log(JSON.parse(JSON.stringify(results)))
        jsonWrite(response, newData);
    })
    .catch(error => { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    });
});

router.post(api.addList, function(request, response) {
    let addData = request.body
    
    let isOk = checkData(addData, response)

    if (isOk) {
        sql.insertSqlData( 'vueTable', addData  ).then(results => {
            console.log(JSON.parse(JSON.stringify(results)))
            jsonWrite(response, newData);
        })
        .catch(error => { 
            console.log('caught', error.message);
            new Error('error: '+error.message) 
        });
    }
});

router.post(api.delList, function(request, response) {
    let contentId = request.body.contentId

    sql.deleteSqlData( 'vueTable', 'contentId='+contentId  ).then(results => {
        console.log(JSON.parse(JSON.stringify(results)))
        jsonWrite(response, newData);
    })
    .catch(error => { 
        console.log('caught', error.message);
        new Error('error: '+error.message) 
    });
});

module.exports = router;