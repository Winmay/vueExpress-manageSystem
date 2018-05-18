var express = require('express');
var sql = require('../config/sql');
var {list} = require('./api');

var router = express.Router();

var jsonWrite = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

var param = 'id INT NOT NULL AUTO_INCREMENT,'
    +'name VARCHAR(100) NOT NULL,'
    +'date VARCHAR(100) NOT NULL,'
    +'address VARCHAR(100) NOT NULL,'
    +'PRIMARY KEY ( id )'

sql.createTable('vueTable' , param)
router.get(list, function(req, res) {

    sql.fetchAllSqlData( 'vueTable' ).then(results => {
        var newData = {list: JSON.parse(JSON.stringify(results))}
        jsonWrite(res, newData);
    })
});

module.exports = router;