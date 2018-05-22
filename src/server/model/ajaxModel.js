/*
var axios = require("axios");

module.exports = {
    ajaxGet (api, cb) {
        console.log(api);
        return new Promise((resolve,reject)=>{
            axios.get(api)
                .then(response => {
                    cb(response);
                    resolve(response);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    },
    ajaxPost (api, post, cb) {
        console.log(api);
        return new Promise((resolve,reject)=>{
            axios.post(api, post)
                .then(response => {
                    cb(response);
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                    console.log(err);
                })
        })
    }
}
*/

import axios from "axios"

export default {
  ajaxGet (api, cb) {
    axios.get(api)
      .then(response => {
        console.log(response)
        cb(response)
      })
      .catch(function(error) {
        console.log(error);
      })
  },
  ajaxPost (api, post, cb) {
    axios.post(api, post)
      .then(response => {
        console.log(response)
        cb(response)
      })
      .catch(err => {
        console.log(err)
      })
  }
}