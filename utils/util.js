const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//时间
const getFormatTime = function (t) {
     return {
          h: formatNumber(t.getHours()),
          m: formatNumber(t.getMinutes()),
          s: formatNumber(t.getSeconds())
     }
};
//获取坐标
function getLocation(callback) {
     wx.getLocation({
          type: 'gcj02',
          success: function (res) {
               callback(true, res.latitude, res.longitude);
          },
          fail: function () {
               callback(false);
          }
     })
}
//调用百度天气
function getWeather(latitude, longitude, callback) {
     var ak = "BlnFFB2QFs08juBYwNE2yGzt4U8lfXp0";
     var url = "https://api.map.baidu.com/telematics/v3/weather?location=" + longitude + "," + latitude + "&output=json&ak=" + ak;
     wx.request({
          url: url,
          success: function (res) {
               callback(res.data);
          }
     });
}

//组合坐标与天气函数
function loadWeatherData(callback) {
     getLocation(function (success, latitude, longitude) {
          getWeather(latitude, longitude, function (weatherData) {
               callback(weatherData);
          });
     });
}

module.exports = {
  formatTime: formatTime,
  loadWeatherData: loadWeatherData,
  //坐标
  getLocation:getLocation,
  //天气
  getWeather:getWeather,
  //时间
  getFormatTime:getFormatTime,
}
