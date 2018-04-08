var util = require('./utils/util.js');
//app.js
App({
     onLaunch: function () {
          var that = this;
          //判断用户微信客户端版本是否过低
          if (wx.getSetting) {
               wx.getSetting({
                    success(res) {
                         if (!res.authSetting['scope.userLocation']) {
                              if (res.authSetting['scope.userLocation'] == false) {
                                   wx.openSetting({
                                        success: (res) => {
                                             console.log(res)
                                        }
                                   })
                              }
                         } 
                    }
               })
          } else {
               // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
               wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
               })
          }
     },
     onShow: function () {

     },
     globalData: {
          
     }
})