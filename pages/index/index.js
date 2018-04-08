//获取应用实例
const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
var util = require('../../utils/util.js');

var qqmapsdk;
var firstLat = '', firstLng = '';
Page({
     data: {
          keyWord: '',
          weather: {},
          lats: '',
          lngs: '',
          addList: {},
          val: '',
          isDisplay: false,
          nowTime: {},
          direction: '--',//指南针文字描述
          angle: '--',//度数
          rotate: '',//旋转度数
          compass: '../../images/compass-dark.png',//指南针图片
     },
     onLoad: function () {
          var that = this;
          // 实例化API核心类
          qqmapsdk = new QQMapWX({
               key: 'BEDBZ-HBJRD-ZZS46-HC4WI-F76N2-M5B5M'
          });

          //获取天气
          util.loadWeatherData(function (data) {
               console.log(data)
               that.setData({
                    weather: data
               });
          });

          //获取当前位置
          util.getLocation(function (tru, lat, lng) {
               firstLat = lat;
               firstLng = lng;
               that.setData({
                    lats: lat,
                    lngs: lng
               });
          });

          // 罗盘Api
          var that = this;
          wx.onCompassChange(function (res) {
               // 罗盘数据保留两位小数
               var directions = res.direction.toFixed(2);
               var radios = res.direction.toFixed(0);
               that.setData({
                    angle: directions,
                    rotate: 360 - radios,
                    direction: check(radios)
               })
          });

          // 判断手机是否有陀旋仪
          // 外部检测，如果没有陀旋仪数据，代码不会进入wx.onCompassChange
          // 必须使用setsetTimeout包裹代码，否则代码立即执行弹窗
          setTimeout(function () {
               if (that.data.direction == '--' && that.data.angle == '--') {
                    wx.showToast({
                         title: '您的手机没有电子罗盘或被禁用',
                         icon: 'loading',
                         duration: 5000,
                         mask: true
                    })
               }
          }, 3000);
          // 判断文字
          function check(i) {
               if (15 <= i && i <= 75) {
                    return '东北'
               } else if (75 < i && i < 105) {
                    return '正东'
               } else if (105 <= i && i <= 165) {
                    return '东南'
               } else if (165 < i && i < 195) {
                    return '正南'
               } else if (195 <= i && i <= 255) {
                    return '西南'
               } else if (255 < i && i < 285) {
                    return '正西'
               } else if (285 <= i && i <= 345) {
                    return '西北'
               } else {
                    return '正北'
               }
          }
     },
     onShow: function () {
          let that = this;
          setInterval(function () {
               that.setData({
                    nowTime: util.getFormatTime(new Date())
               })
          }, 1000);
     },
     //获取输入的关键词
     keyWords: function (e) {
          let _this = this;
          //根据关键词输入提示
          qqmapsdk.getSuggestion({
               keyword: e.detail.value,
               success: function (res) {
                    if (res.data.length == 0) {
                         return false;
                    }
                    let locLat = res.data[0].location.lat;
                    let locLng = res.data[0].location.lng;
                    _this.setData({
                         isDisplay: true,
                         lats: locLat,
                         lngs: locLng,
                         addList: res.data
                    });
                    //获取天气
                    util.getWeather(locLat, locLng, function (data) {
                         _this.setData({
                              weather: data
                         });
                    });
               },
               fail: function (res) {
                    //当输入框清空时
                    _this.setData({
                         lats: firstLat,
                         lngs: firstLng,
                         addList: {}
                    });
                    //获取天气
                    util.getWeather(firstLat, firstLng, function (data) {
                         _this.setData({
                              weather: data
                         });
                    });
               }
          });
     },
     getAddress: function (e) {
          this.setData({
               val: e.currentTarget.dataset.address,
               isDisplay: false
          })
          let _this = this;
          //获取关键词
          qqmapsdk.getSuggestion({
               keyword: e.currentTarget.dataset.address,
               success: function (res) {
                    if (res.data.length == 0) {
                         return false;
                    }
                    let getLocLat = res.data[0].location.lat;
                    let getLocLng = res.data[0].location.lng;
                    _this.setData({
                         lats: getLocLat,
                         lngs: getLocLng,
                    });
                    //获取天气
                    util.getWeather(getLocLat, getLocLng, function (data) {
                         _this.setData({
                              weather: data
                         });
                    });
               },
               fail: function (res) {
                    console.log(res)
               }
          });
     },
     // 设置页面分享
     onShareAppMessage: function () {
          return {
               title: '分享TT导航 ！',
               path: '/pages/index/index'
          }
     }
})
