var util = require('../../utils/util.js')
var vm = null
const app = getApp()

var page_count = 1;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bihuas: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    vm = this;
    vm.getBihuas();
    wx.setNavigationBarTitle({
      title: '最新壁画'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //按照最热获取壁画
  getBihuas: function () {
    var param = {
      seq_type: 'zx',
      page: page_count
    }
    util.getListByCon(param, function (res) {
      console.log("getbihuas : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        var bihuas = vm.data.bihuas
        bihuas = bihuas.concat(res.data.ret.data);
        // console.log("after concat : " + JSON.stringify(bihuas)) 
        vm.setData({
          bihuas: bihuas
        })
        page_count++;
      } else {
        util.showToast(ret.data.message);
      }

    }, function () {
      console.log("错误回调")
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  //下拉刷新
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    vm.getBihuas();
  },

  /**
   * 用户点击右上角分享
   */
  //分享
  onShareAppMessage: function () {
    var title = "分享2018最新的壁画，点击接收惊喜！";
    var path = '/pages/index_zr/index_zr';
    return {
      title: title,
      path: path
    }
  },
  //点击壁画
  onClickBihua: function (e) {
    console.log("onClickBihua e:" + JSON.stringify(e))
    var index = e.currentTarget.dataset.index;
    var bihuas = vm.data.bihuas;
    var img_arr = [];
    for (var i = 0; i < bihuas.length; i++) {
      img_arr.push(bihuas[i].img)
    }
    wx.previewImage({
      current: img_arr[index], // 当前显示图片的http链接
      urls: img_arr // 需要预览的图片http链接列表
    })
  },

  //点击收藏
  onClickFavor: function (e) {
    console.log("clickFavor e:" + JSON.stringify(e))
    var index = e.currentTarget.dataset.index;
    var bihuas = vm.data.bihuas;
    if (bihuas[index].coll_flag) {
      util.showToast('已经收藏');
    } else {
      bihuas[index].coll_flag = true;
      vm.setData({
        bihuas: bihuas
      })
      //调用收藏接口
      //未收藏 存入方法
      var param = {
        bihua_id: bihuas[index].id  //壁画ID
      }
      util.collBihua(param, function (res) {//收藏壁画 传值需要壁画的ID
        if (res.data.code == "200" && res.data.result == true) {//第一次收藏
          util.showToast('收藏成功');
        }
      }, function () {
        console.log("错误回调")
      })
    }
  }
})