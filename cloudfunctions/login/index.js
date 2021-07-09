// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {url} = event

  return new Promise((resolve, reject)=>{
    request(url, function (error, response, body) {
      resolve({response, ...wxContext})
    })
  })
}