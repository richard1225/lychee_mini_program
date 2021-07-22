//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
    wx.getStorage({
      key: 'currentUserOpenId',
      success: function (res) {
        var value1 = res.data
        console.log(`读取Openid缓存成功: ${value1}`)
      },
      fail: function () {
        console.log(`读取openid失败，从线上拉取openid`)
        wx.login({
          success: function (res) {
            if (res.code) {
              console.log(res)
              // wx.request({
              //   url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx7d32a3e423cd8a86&secret=02984f30d8f98ba83ab895cdc2f81245&js_code=${res.code}&grant_type=authorization_code`,
              //   success: function(res){
              //     console.log('success', res)
              //   }
              // })
              wx.cloud.callFunction({
                name: 'login', // 云函数名称
                data: {
                  url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx7d32a3e423cd8a86&secret=02984f30d8f98ba83ab895cdc2f81245&js_code=${res.code}&grant_type=authorization_code`
                }, // 传给云函数的参数
                success: function ({result}) {
                  console.log(result)
                  wx.setStorage({
                    key: "currentUserOpenId",
                    data: result.OPENID,
                    success: function () {
                      console.log(`${result.OPENID}写入OpenId成功`)
                    },
                    fail: function () { console.log(`写入${result.OPENID}发生错误`)}
                  })
                },
                fail: console.error
              })
            } else {
              console.log('获取用户登录态失败！' + result)
            }
          }
        })
      }
    })


  }
})