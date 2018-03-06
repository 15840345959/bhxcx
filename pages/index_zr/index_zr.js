var util = require('../../utils/util.js')
var vm = null
const app = getApp()
var page = 1; //下拉加载更多
var loadding_flag = false;  //页面是否在获取数据中..
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,//搜索
    inputVal: "",//搜索
    Hotbihua: [],  
    showAlert: false,//显示弹窗
    toast: "",//toast 
    //toast默认不显示  
    isShowFailToast: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    vm = this;
    vm.getHotbihua(),  
      wx.setNavigationBarTitle({
        title: '最热壁画'
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
    vm.init()
  },
  //获取用户收藏并判断壁画列表是否被收藏过
  getListByUserId: function () {
    util.getListByUserId({}, function (res) {
      console.log("获取用户收藏数据" + JSON.stringify(res.data.ret))
      var collect = res.data.ret
      var bihua = vm.data.Hotbihua
      for (var i = 0; i < collect.length; i++) {
        for (var j = 0; j < bihua.length; j++) {
          console.log("对比" + JSON.stringify(bihua[j].id + "------" + collect[i].bihua_id))
          if (bihua[j].id == collect[i].bihua_id) {
            bihua[j].check = true
          }
        }
      }
      vm.setData({ Hotbihua: bihua })
    })
  },
  //初始化数据
  init: function () {
    var Hotbihua = vm.data.Hotbihua
    for (var i = 0; i < Hotbihua.length; i++) {
      Hotbihua[i].check = false
    }
    vm.setData({
      Hotbihua: Hotbihua
    })
    vm.getListByUserId()
    console.log("初始化数据" + JSON.stringify(Hotbihua))
  },
  //获取下用户信息
  getByUserId:function(res){
    var param = {
      id: app.globalData.userInfo.id
    }
    util.getByUserId(param,function(res){
      console.log("getByUserId" + JSON.stringify(res))  
      if (res.data.code == "200" && res.data.result == true) {
        vm.setData({
          phonenumber: res.data.ret.phonenum//进来就检测到了用户手机号
        })
      }  
    })
  },
  //获取最热壁画图
  getHotbihua: function () {
    vm.getByUserId()
    var param = {
      seq_type: "zr"
    }
    util.getHotbihua(param, function (res) { 
      //console.log("Newbihua : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        //成功 则ad 被赋值得到的数据
        var Hotbihua = res.data.ret.data;
        var Hotbihua1 = Hotbihua;
        var Hotbihua2 = vm.data.Hotbihua;
        for (var i in Hotbihua1) {//循环出最新壁画所有信息
          Hotbihua2.push(Hotbihua1[i])
        } 
        vm.init()  
        // console.log("Hotbihua:11" + JSON.stringify(vm.data.Hotbihua));
      } else {
        util.showToast(ret.data.message);
      }

    }, function () {
      console.log("错误回调")
    })
  }, 

  //显示弹窗
  showToast: function () {
    //console.log("asdasd" + JSON.stringify(e))
    vm.setData({ 
      showAlert: true
    }) 
  },

  //隐藏弹窗
  hiddonToast: function () {
    vm.setData({ showAlert: false })
  },

  //获取填写的手机号
  getInput: function (e) {
    console.log("word" + JSON.stringify(e.detail.value))
    var value = e.detail.value
    vm.setData({
      toast: value//设置进去
    })
  },
  showFailToast: function () {
    var _this = this;
    // toast时间  
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast  
    _this.setData({
      isShowFailToast: true,
    });
    // 定时器关闭  
    setTimeout(function () {
      _this.setData({
        isShowFailToast: false
      });
    }, _this.data.count);
  },
  /* 点击按钮 */
  clickBtn: function () {
    //console.log("你点击了按钮")
    //设置toast时间，toast内容  
    this.setData({
      count: 2000,
      toastText: '只有输入手机号才可收藏哦'
    });
    this.showFailToast();
  },

  click: function (e) {//显示或隐藏收藏按钮 
    //如果此人无手机号 让他填写
    if (vm.data.phonenumber==null){
      console.log("没手机号 让他填写") 
      vm.showToast()// 显示showToast 
    }else{  
      //console.log("asdasd"+app.globalData.userInfo.phonenum) 
      vm.hiddonToast()// 隐藏showToast 
    var id = e.currentTarget.dataset.id//得到索引
    var bihuaId = e.currentTarget.dataset.bihuaid//得到壁画ID    
    var Hotbihua = vm.data.Hotbihua
    if (Hotbihua[id].check === false) {
      Hotbihua[id].check = !Hotbihua[id].check
      console.log("Hotbihua : " + JSON.stringify(Hotbihua[id]))
      vm.setData({
        Hotbihua: Hotbihua,
      })
    }
    //未收藏 存入方法
    var param_a = {
      bihua_id: bihuaId//壁画ID
    }
    util.collBihua(param_a, function (res) {//收藏壁画 传值需要壁画的ID
      if (res.data.code == "200" && res.data.result == true) {//第一次收藏
        wx.showToast({
          title: '成功',
        })  
      } else {//如果返回false 证码已经收藏过
        wx.showToast({
          title: "您已经收藏过啦",
        })
      }
    }, function () {
      console.log("错误回调")
    }) 
    }   //判断手机号
  },
  
  //更新用户信息添加手机号 
  updateById: function() {
    var param = {
      phonenum: vm.data.toast
    } 
    util.updateById(param, function (res) {
      console.log("updateById : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) { 
        vm.setData({
          updateById: res.data.ret,
          phonenumber: res.data.ret.phonenum
        }) 
        //更新用户信息
        vm.hiddonToast()//关闭弹窗 
      } else {
        //输入为空时
        vm.hiddonToast()
        vm.clickBtn()//自定义显示的toast 
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
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }, 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  //分享
  onShareAppMessage: function () {
    var title = "我分享给你的小程序看一下吧";
    var path = '/pages/index_zr/index_zr';
    return {
      title: title,
      path: path
    }
  },
  //搜索跳转
  searchBH: function () {
    wx.navigateTo({
      url: "/pages/search/search"
    })
  }
})