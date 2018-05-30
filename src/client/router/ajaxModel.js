import axios from "axios"

export default {
  ajaxGet (api, params) {
    console.log(api);
    return new Promise((resolve,reject)=>{
      axios.get(api, params)
        .then(response => {
          /*var resultJson = response.data
          if (resultJson.code !== 0) {
            var error = new Error("businessError:" + resultJson.msg)
            error.code = resultJson.code
            throw error
          }*/
          resolve(response.data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    })
  },
  ajaxPost (api, data) {
    console.log(api);
    return new Promise((resolve,reject)=>{
      axios.post(api, data)
          .then(response => {
            resolve(response.data);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          })
    })
  }
}

/*
import axios from "axios"

export default {
  ajaxGet (api, params, cb) {
    axios.get(api)
      .then(response => {
        console.log(response)
        var resultJson = response.data
        if (resultJson.code !== 0) {
          var error = new Error("businessError:" + resultJson.msg)
          error.code = resultJson.code
          throw error
        }
        if (cb) {
          cb(response)
        }
      })
      .catch(function(error) {
        console.log(error);
      })
  },
  ajaxPost (api, data, cb) {
    axios.post(api, data)
      .then(response => {
        console.log(response)
        var resultJson = response.data
        if (resultJson.code !== 0) {
          var error = new Error("businessError:" + resultJson.msg)
          error.code = resultJson.code
          throw error
        }
        if (cb) {
          cb(response)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
*/
