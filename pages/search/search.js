// pages/search/search.js
var util = require('../../utils/util.js')
var vm = null

var page_count = 1;

//重新搜索
var new_loadding_flag = true;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    search_word: "",
    bihuas: [],
    no_view_hidden: 'hidden',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    page_count = 1;
    wx.setNavigationBarTitle({
      title: '搜索壁画'
    })
  },
  //输入搜索内容
  inputSearchWord: function (e) {
    console.log("inputRealName e:" + JSON.stringify(e));
    this.setData({
      search_word: e.detail.value
    })
  },

  //点击搜索
  clickSearch: function () {
    console.log("clickSearch");
    new_loadding_flag = true;   //设置为重新加载
    page_count = 1;
    vm.searchBihua();
  },

  //搜索壁画
  searchBihua: function () {
    var param = {
      search_word: vm.data.search_word,
      page: page_count,
    }
    // console.log("paramm : " + JSON.stringify(res))
    util.search(param, function (res) {
      console.log("search : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        var bihuas = vm.data.bihuas
        if (!new_loadding_flag) {
          bihuas = bihuas.concat(res.data.ret.data);
        } else {
          bihuas = res.data.ret.data
          new_loadding_flag = false;
        }
        console.log("after concat : " + JSON.stringify(bihuas))
        vm.setData({
          bihuas: bihuas
        })
        page_count++;
        //是否展示未找到内容的页面
        if (vm.data.bihuas.length <= 0) {
          vm.setData({
            no_view_hidden: ''
          })
        } else {
          vm.setData({
            no_view_hidden: 'hidden'
          })
        }
      } else {
        util.showToast(ret.data.message);
      }
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
    vm.searchBihua();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})