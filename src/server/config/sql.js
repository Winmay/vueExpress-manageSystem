//链接数据库  数据库增、删、减、查操作

var mysql = require('mysql')
var config = require('./db.js')
var Date = require('../public/js/date')

/***创建链接池***/
var pool = mysql.createPool({
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database,
});


//监听connection事件
pool.on('connection', function(connection) {  
    connection.query('SET SESSION auto_increment_increment=1'); 
});  

pool.on('error', function(err) {
  console.log("[mysql error]",err);
});

/***数据库链接与执行***/
var query = (sql,val) => {
	return new Promise((resolve,reject)=>{
		//链接数据库
		pool.getConnection((err,connection)=>{
			if (err){
				console.log('getConnection')
				console.log(err)
				reject(err)
			} else{
				//执行SQL语句
				connection.query(sql,val,(err,result)=>{
					if (err) {
						console.log('query')
						console.log(err)
						reject(err)
					}else{
						resolve(result)
					}
					// 调用connection.release()方法，会把连接放回连接池，等待其它使用者使用!
					connection.release()
				})
			}
		})
	})
}

/**
*创建数据库表
*@sqlName string  表名
*@sqlparam string  表字段和参数
*@comment string  表名备注
*/
var createTable = ( sqlName, sqlparam, comment ) => {
	if( comment ) {
		var _sql = `create table if not exists ${sqlName}( ${sqlparam} )ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8 COMMENT="${comment}";`
		// console.log(_sql)
		return query( _sql, [] )
	} else {
		var _sql = `create table if not exists ${sqlName}( ${sqlparam} )ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8;`
		// console.log(_sql)
		return query( _sql, [] )
	}
}
/*var param = 'id INT NOT NULL AUTO_INCREMENT,'
    +'userName VARCHAR(100) NOT NULL,'
    +'date VARCHAR(100) NOT NULL,'
    +'content VARCHAR(100) NOT NULL,'
    +'videoName VARCHAR(100) NOT NULL,'
    +'uid VARCHAR(100) NOT NULL,'
    +'avator VARCHAR(100) NOT NULL DEFAULT "",'
    +'PRIMARY KEY ( id )'

createTable('comments ' , param, '评论')*/


/**
*删除数据库表
*@sqlName string  表名
*/
var deleteTable = ( sqlName ) => {
	var _sql = `drop table ${sqlName};`
	console.log(_sql)
	return query( _sql, [] )
}

// deleteTable('comments');

/**
*查找数据
*@table string  表名
*/
//查找表中的所有数据
var fetchAllSqlData = ( table ) => {
	var _sql = `select * from ${table};`
	return query( _sql )
}
/*fetchAllSqlData( 'datasource' ).then(res => {
	// console.log(res)
	console.log(JSON.parse(JSON.stringify(res)))
})*/


//带条件查找数据
// @condition string 条件
// 用where关键字来实现，可以使用<>!=等多条件可以使用or、and等 
var fetchConditionSqlData = ( table, condition, value, param ) => {
	if( param ){
		var _sql = `select ${param} from ${table} where ${condition};`
	}else{
		var _sql = `select * from ${table} where ${condition};`
	}
	return query( _sql, value )
}
/*fetchConditionSqlData( 'datasource' , 'name=?',["周磊"] ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

//搜索
var fetchSearchSqlData = ( table, param, keywords, page, num ) => {
	var _sql = `select * from ${table} where ${param} like '%${keywords}%' limit ${(page - 1) * num},${num};`
	return query( _sql )
}
/*fetchSearchSqlData( 'datasource' , 'name', '平' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

/*
排序和限制  
desc和asc是排序关键字，desc是降序、asc是升序排列 ORDER BY 排序,默认是升序  
select * from emp order by sal;  
如果排序字段的值一样，则值相同的字段按照第二个排序字段进行排序，如果只有一个排序字段，则相同字段将会无序排序  
select * from emp order by deptno,sal desc;  
限制  
select * from emp order by sal limit 3;  
//前者是起始偏移量，后者是显示行数  
select * from emp order by sal limit 1,3;  
  
limit 和order by 一起使用来做分页  
*/
// 分页数据查找
var fetchPageSqlData = ( table, page, num ) => {
	var _sql = `select * from ${table} limit ${(page - 1) * num},${num}; `
	return query(_sql)
}
/*fetchPageSqlData( 'datasource' , 1, 3 ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

//升序排列
var fetchAscSqlData = ( table, param ) => {
    var _sql = `select * from ${table} order by ${param} asc; `
    return query(_sql)
}
/*fetchAscSqlData( 'datasource' , 'id' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

//降序排列
var fetchDescSqlData = ( table, param ) => {
    var _sql = `select * from ${table} order by ${param} desc; `
    return query(_sql)
}
/*fetchDescSqlData( 'datasource' , 'id' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

//查找不重复数据
//@param string 需要查找的参数
var fetchDistinctSqlData = ( table, param ) => {
	var _sql = `select distinct ${param} from ${table};`
	return query( _sql )
}
/*fetchDistinctSqlData( 'datasource' , 'name' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})
*/


//统计查询
var fetchCountSqlData = ( table, param ) => {
	//param为*时，统计表中有多少条数据
	if( param ){
    	var _sql = `select count( ${param} ) as count from ${table}; `
    }else{
    	var _sql = `select count( * ) as count from ${table}; `
    }
    return query(_sql)
}
/*fetchCountSqlData( 'datasource' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

var fetchMaxSqlData = ( table, param ) => {
	//查询列值中的最大值
	var _sql = `select max( ${param} ) from ${table}; `
    return query(_sql)
}
/*fetchMaxSqlData( 'datasource', 'id' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

var fetchMinSqlData = ( table, param ) => {
	//查询列值中的最小值
	var _sql = `select min( ${param} ) from ${table}; `
    return query(_sql)
}
/*fetchMinSqlData( 'datasource', 'id' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

var fetchSumSqlData = ( table, param ) => {
	//求列值中的总和
	var _sql = `select sum( ${param} ) from ${table}; `
    return query(_sql)
}
/*fetchSumSqlData( 'datasource', 'id' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

var fetchAvgSqlData = ( table, param ) => {
	//求列值中的平均值
	var _sql = `select avg( ${param} ) from ${table}; `
    return query(_sql)
}
/*fetchAvgSqlData( 'datasource', 'id' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

var selectSqlData = ( table, mode, param ) => {
	switch( mode ){
		case 'asc':
			//升序排列
			return fetchAscSqlData( table, param )
		case 'desc':
			//降序排列
			return fetchDescSqlData( table, param )
		case 'distinct':
			//查找不重复数据
			return fetchDistinctSqlData( table, param )
		case 'count':
			//统计表中有多少条数据
			return fetchCountSqlData( table, param )
		case 'max':
			//查询列值中的最大值
			return fetchMaxSqlData( table, param )
		case 'min':
			//查询列值中的最小值
			return fetchMinSqlData( table, param )
		case 'sum':
			//求列值中的总和
			return fetchSumSqlData( table, param )
		case 'avg':
			//求列值中的平均值
			return fetchAvgSqlData( table, param )
	}
}
/*selectSqlData( 'datasource', 'id', 'count' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

var selectGroupSqlData = ( table, param, groupName) => {
	//将查询结果按照某一列或多列的值分组，值相等的为一组
	var _sql = `select ${param} from ${table} group by ${groupName}; `
    return query(_sql)
}
/*selectGroupSqlData( 'producttable', 'categoryId, count(categoryId) as count', 'categoryId' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

/***增加（插入）数据***/
var insertSqlData = ( table, object ) => {
	let addData = object
    let time = new Date().format("yyyy-MM-dd hh:mm:ss")
    let param = ''
    let value = Object.values(addData);
    let index = 0
    for( let key in addData ){
        /*if( addData[key] == value[value.length-1] ){
            param = param + key + '=?';
        }else{
            param = param + key + '=?,';
        }*/
        param = param + key + '=?,';
        if( typeof addData[key] === 'object' ){
        	value[index] = JSON.stringify(addData[key])
        }
    	index++
    }
    param = param + 'createTime=?,updateTime=?'
    value.push(time)
    value.push(time)
    console.log(addData)
    console.log('param:'+param)
    console.log('value:'+value)

	var _sql = `insert into ${table} set ${param}; `
    return query(_sql, value) 
}
/*var aaa = 'name=?,email=?,ip=?'
var bbb = ['aa','aa@dwegf.fe','23.453.23.4']
insertSqlData( 'datasource', aaa, bbb ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/


/***更新数据***/
var updateSqlData = ( table, object, condition ) => {

	let modData = object
    let time = new Date().format("yyyy-MM-dd hh:mm:ss")
    modData.updateTime = time
    let param = ''
    let value = Object.values(modData);
    let index = 0
    for( let key in modData ){
        if( modData[key] == value[value.length-1] ){
            param = param + key + '=?';
        }else{
            param = param + key + '=?,';
        }
        // param = param + key + '=?,';
        if( typeof modData[key] === 'object' ){
        	value[index] = JSON.stringify(modData[key])
        }
    	index++
    }
    // param = param + 'updateTime=?'
    // value.push(time)
    console.log(modData)
    console.log('param:'+param)
    console.log('value:'+value)

	if( condition ){
		var _sql = `update ${table} set ${param} where ${condition}; `
	}else{
		var _sql = `update ${table} set ${param}; `
	}
	console.log(_sql)
    return query(_sql, value) 
}
/*var dd = 'name=?,email=?,ip=?'
var cc = ['gg','ee@dwsdf.fe','23.43.23.4']
updateSqlData( 'datasource', dd, cc, 'id=13' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

/***删除数据***/
var deleteSqlData = ( table, condition ) => {
	if( condition ){
		var _sql = `delete from ${table} where ${condition}; `
	}else{
		var _sql = `delete from ${table}; `
	}
    return query(_sql) 
}
/*deleteSqlData( 'datasource', 'id=14' ).then(res => {
	console.log(JSON.parse(JSON.stringify(res)))
})*/

module.exports = {
	createTable,			//创建数据库表
	deleteTable,			//删除数据库表
	fetchAllSqlData,		//查找表中的所有数据
	fetchConditionSqlData,	//带条件查找数据
	fetchSearchSqlData,		//搜索
	fetchPageSqlData,		//分页数据查找
	selectSqlData,			//排序查询、去重查询、统计函数查询
	selectGroupSqlData,		//分组查询
	insertSqlData,			//增加（插入）数据
	updateSqlData,			//更新数据
	deleteSqlData			//删除数据
}