var jsonWrite = function(response, data) {
    console.log('data:'+typeof data)
    /*code枚举值如下： 
    空数据：1 
    未知错误 10001； 
    校验错误 10002； 
    权限错误 10003； 
    参数错误 10004；*/ 
    if (typeof data === 'undefined') {
        response.json({
            code: 1,
            msg: '操作失败'
        });
    } else {
        response.json(data);
    }
};

module.exports = jsonWrite;