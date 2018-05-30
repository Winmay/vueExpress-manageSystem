//加入日期扩展
(function(){
  Date.prototype.format =function(format)
    {
        var o = {
      "M+" : this.getMonth()+1, //month
      "d+" : this.getDate(),    //day
      "h+" : this.getHours(),   //hour
      "m+" : this.getMinutes(), //minute
      "s+" : this.getSeconds(), //second
      "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
      "S" : this.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length==1? o[k] :
        ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }
  Date.parseByFormat = function(format,string){
    //抽取所有整数
    var digits = string.match(/\d+/g);
    for( var i = 0 ; i != digits.length ; ++i )
      digits[i] = parseInt(digits[i]);
    var data = {
      year:0,
      month:0,
      day:0,
      hour:0,
      minute:0,
      second:0
    };

    //分析匹配规则
    var o = {
      'y+':'year',
      'M+':'month',
      "d+" :'day',
      "h+" :'hour',
      "m+" :'minute',
      "s+" : 'second'
    };
    var finder = [];
    for( var i in o ){
      var temp = format.match(i);
      if( temp == null )
        continue;
      finder.push({
        index:temp.index,
        rule:o[i]
      });
    }
    finder.sort(function(a,b){
      return a.index - b.index;
    });
    //填充数据
    for( var i = 0 ; i != finder.length ; ++i ){
      var item = finder[i];
      data[item.rule] = digits[i];
    }
    return new Date(
      data.year,
      data.month-1,
      data.day,
      data.hour,
      data.minute,
      data.second
    );
  }
})();

module.exports = Date;