'use strict';

(function () {
  Date.prototype.format = function (format) {
    var o = {
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(),    //day
      "h+": this.getHours(),   //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
      "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  Date.parseByFormat = function (format, string) {
    //抽取所有整数
    var digits = string.match(/\d+/g);
    for (var i = 0; i != digits.length; ++i)
      digits[i] = parseInt(digits[i]);
    var data = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    };

    //分析匹配规则
    var o = {
      'y+': 'year',
      'M+': 'month',
      "d+": 'day',
      "h+": 'hour',
      "m+": 'minute',
      "s+": 'second'
    };
    var finder = [];
    for (var i in o) {
      var temp = format.match(i);
      if (temp == null)
        continue;
      finder.push({
        index: temp.index,
        rule: o[i]
      });
    }
    finder.sort(function (a, b) {
      return a.index - b.index;
    });
    //填充数据
    for (var i = 0; i != finder.length; ++i) {
      var item = finder[i];
      data[item.rule] = digits[i];
    }
    return new Date(
      data.year,
      data.month - 1,
      data.day,
      data.hour,
      data.minute,
      data.second
    );
  }

  Date.countdown = function (endTime, callback) {

    var sUnit = 1000;
    var mUnit = 60 * sUnit;
    var hUnit = 60 * mUnit;
    var timeInterval;

    var _countdown = function () {
      var currentTime = new Date();
      var diff = endTime.getTime() - currentTime.getTime();
      if (diff <= 0) {
        callback && callback();
        clearInterval(timeInterval);
        return;
      }

      var balance = diff % hUnit;
      var hour = (diff - balance) / hUnit;

      var balanceDiff = balance;
      balance = balance % mUnit;
      var minute = (balanceDiff - balance) / mUnit;

      balanceDiff = balance;
      balance = balance % sUnit;
      var second = (balanceDiff - balance) / sUnit;

      callback && callback({hour: hour, minute: minute, second: second});
    };

    timeInterval = setInterval(_countdown, 1000);
    _countdown();

    return timeInterval;
  }

})();

function getInterval(date) {
  var aDate = Date.parseByFormat('yyyy-MM-dd hh:mm:ss', date);
  var newDate = new Date();
  var differentValue = parseInt((newDate.valueOf() - aDate.valueOf()) / 1000);
  if (differentValue < 0) {
    return '0秒前';
  } else if (differentValue < 60) {
    return differentValue + '秒前';
  } else if (differentValue < 60 * 60) {
    return parseInt(differentValue / 60) + '分钟前';
  } else if (differentValue < 60 * 60 * 24) {
    return parseInt(differentValue / (60 * 60)) + '小时前';
  } else if (differentValue < 60 * 60 * 24 * 365) {
    return aDate.format('MM-dd');
  } else {
    return aDate.format('yyyy-MM-dd');
  }
};

module.exports = {
  getInterval: getInterval,
  Date: Date
};