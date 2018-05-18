var apiModel = require('../config/sql')

function User(user){
  this.username = user.username
  this.userpass = user.userpass
};

module.exports = User

//保存数据
User.prototype.save = function save(callback) {
 
  var user = {
    username: this.username,
    userpass: this.userpass
  };

  apiModel.insertSqlData('userinfo', 'username=?,userpass=?', [user.username, user.userpass]).then(res => {
    console.log("invoked[getUserByUserName]")
    callback(res)
  })
}; 

//根据用户名得到用户信息
User.getUserByUserName = function getUserNumByName(username, callback) {

  apiModel.fetchConditionSqlData('userinfo', 'username=?', [username]).then(res => {
    console.log("invoked[save]")
    callback(res)
  })
};

//根据用户名得到用户数量
User.getUserNumByName = function getUserNumByName(username, callback) {
    
  apiModel.fetchConditionSqlData('userinfo', 'username=?', [username], 'COUNT(1) AS num').then(res => {
    console.log("invoked[getUserNumByName]")
    callback(res)
  })
    
};