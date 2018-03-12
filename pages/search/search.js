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
    // no_view_hidden: 'hidden',
    // showAlert: false,//显示弹窗
    // toast: "",//toast 
    // //toast默认不显示  
    // isShowFailToast: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    page_count = 1;
    // vm.getByUserId();
    wx.setNavigationBarTitle({
      title: '搜索壁画'
    })
  },
  // //获取下用户信息
  // getByUserId: function (res) {
  //   var param = {
  //     id: app.globalData.userInfo.id
  //   }
  //   util.getByUserId(param, function (res) {
  //     console.log("getByUserId" + JSON.stringify(res))
  //     if (res.data.code == "200" && res.data.result == true) {
  //       vm.setData({
  //         phonenumber: res.data.ret.phonenum//进来就检测到了用户手机号
  //       })
  //     }
  //   })
  // },
  // //显示弹窗
  // showToast: function () {
  //   //console.log("asdasd" + JSON.stringify(e))
  //   vm.setData({
  //     showAlert: true
  //   })
  // },

  // //隐藏弹窗
  // hiddonToast: function () {
  //   vm.setData({ showAlert: false })
  // },

  // //获取填写的手机号
  // getInput: function (e) {
  //   console.log("word" + JSON.stringify(e.detail.value))
  //   var value = e.detail.value
  //   vm.setData({
  //     toast: value//设置进去
  //   })
  // },
  // showFailToast: function () {
  //   var _this = this;
  //   // toast时间  
  //   _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
  //   // 显示toast  
  //   _this.setData({
  //     isShowFailToast: true,
  //   });
  //   // 定时器关闭  
  //   setTimeout(function () {
  //     _this.setData({
  //       isShowFailToast: false
  //     });
  //   }, _this.data.count);
  // },
  // /* 点击按钮 */
  // clickBtn: function () {
  //   //console.log("你点击了按钮")
  //   //设置toast时间，toast内容  
  //   this.setData({
  //     count: 2000,
  //     toastText: '请输入正确手机号'
  //   });
  //   this.showFailToast();
  // },

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
  //点击收藏
  onClickFavor: function (e) {
    // //如果此人无手机号 让他填写
    // if (vm.data.phonenumber == null) {
    //   console.log("没手机号 让他填写")
    //   vm.showToast()// 显示showToast 
    // } else {
    //   vm.hiddonToast()// 隐藏showToast  
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
    //}
  },
  //点击壁画
  onClickBihua: function (e) {
    // console.log("onClickBihua e:" + JSON.stringify(e))
    var index = e.currentTarget.dataset.index;
    var favors = vm.data.bihuas;
    var img_arr = [];
    for (var i = 0; i < favors.length; i++) {
      img_arr.push(favors[i].bihua.img)
    }
    wx.previewImage({
      current: img_arr[index], // 当前显示图片的http链接
      urls: img_arr // 需要预览的图片http链接列表
      // urls: [img_arr[index]] // 需要当前预览的图片http链接

    })
  },

  //更新用户信息添加手机号 
  // updateById: function () {
  //   var param = {
  //     phonenum: vm.data.toast
  //   }
  //   if (vm.data.toast.length == 11) { 
  //     util.updateById(param, function (res) {
  //       console.log("updateById : " + JSON.stringify(res))
  //       if (res.data.code == "200" && res.data.result == true) {
  //         vm.setData({
  //           updateById: res.data.ret,
  //           phonenumber: res.data.ret.phonenum
  //         })
  //         if (vm.data.phonenumber == null) {//如果有手机号为空
  //           vm.hiddonToast()//关闭弹窗 
  //           vm.clickBtn()//自定义显示的toast 
  //         }
  //       } else {
  //         //输入为空时
  //         vm.hiddonToast()
  //       }
  //     }, function () {
  //       console.log("错误回调")
  //     })
  //     vm.hiddonToast()//关闭弹窗 
  //   } else {
  //     vm.hiddonToast()//关闭弹窗 
  //     vm.clickBtn()//自定义显示的toast 
  //   }
  // }, 
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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