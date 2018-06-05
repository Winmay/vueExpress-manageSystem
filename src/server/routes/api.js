var _url = "/api"

module.exports = {
  //user
  loginIn: _url + '/login',

  //list
  list: _url + '/list',
  getList: _url + '/list/get',
  modList: _url + '/list/mod',
  addList: _url + '/list/add',
  delList: _url + '/list/del',

  //product
  allProduct: _url + '/product',
  getProduct: _url + '/product/get',
  modProduct: _url + '/product/mod',
  addProduct: _url + '/product/add',
  delProduct: _url + '/product/del',
  delAllProduct: _url + '/product/delAll',

  //category
  getCategory: _url + '/category/get',
  modCategory: _url + '/category/mod',
  addCategory: _url + '/category/add',
  delCategory: _url + '/category/del',
  delAllCategory: _url + '/category/delAll',
}
 