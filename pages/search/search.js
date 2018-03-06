// pages/search/search.js
var util = require('../../utils/util.js')
var vm = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],//设置显示隐藏的data
    inputVal: "",//搜索框值 
    no_view_hidden: "hidden",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    wx.setNavigationBarTitle({
      title: '搜索壁画'
    })
  },
  //搜索框
  getTitle: function (e) {
    console.log("输入框的文字：" + e.detail.value)
    vm.setData({
      inputVal: e.detail.value,
    })
  },
  //模糊查询图
  search: function () {
    var param = {
      search_word: vm.data.inputVal
    }
    // console.log("paramm : " + JSON.stringify(res))
    util.search(param, function (res) {
      console.log("search : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        vm.setData({
          search: res.data.ret,
        })
        if (vm.data.inputVal != null) {//输入 但数据库无
          console.log("搜索了但没值")
          vm.setData({
            no_view_hidden: "",
            no_view_hidden_w: "hidden"
          })
        }
        if (res.data.ret != '') {//点击搜索 默认是数据全出现 
          vm.setData({
            no_view_hidden: "hidden",
            no_view_hidden_w: "hidden"
          })
        }
        if (vm.data.inputVal == null) {//不输入 点击搜索按钮时
          vm.setData({
            no_view_hidden: "hidden",
            no_view_hidden_w: "hidden"
          })
        }
      } else {
        // util.showToast(ret.data.message);
      }
    }, function () {
      console.log("错误回调")
    })
  },
  click: function (e) {//显示或隐藏收藏按钮
    console.log("321" + JSON.stringify(e))
    var id = e.currentTarget.dataset.id//得到索引
    var bihuaId = e.currentTarget.dataset.bihuaid//得到壁画ID    
    var search = vm.data.search
    search[id].check = search[id].check
    //console.log("Newbihua : " + JSON.stringify(Newbihua[id]))


    //未收藏 存入方法
    var param_a = {
      bihua_id: bihuaId//壁画ID
    }
    util.collBihua(param_a, function (res) {//收藏壁画 传值需要壁画的ID
      if (res.data.code == "200" && res.data.result == true) {//第一次收藏是这种结果 
        wx.showToast({
          title: '成功',
        })
        search[id].collect = res.data.ret.id
        vm.setData({
          search: search,
        })
        console.log("111" + JSON.stringify(res))
      } else {
        wx.showToast({
          title: "您已经收藏过啦",
        })
      }
    }, function () {
      console.log("错误回调")
    })


  },


  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})