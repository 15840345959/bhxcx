var util = require('../../utils/util.js')
var vm = null
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
var vm;
//一级分类-全部
var level1_all = {
  "id": 0,
  "name": "全部",
  "seq": 0,
  "admin_id": 9,
  "status": "1",
  "created_at": "2018-02-10 07:56:55",
  "updated_at": "2018-02-10 07:59:37",
  "deleted_at": null
}


Page({
  data: {
    open: false,//控制菜单的开启关闭
    inputShowed: false,//搜索
    inputVal: "",//搜索
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    ad: [],   //轮播图数据
    bihua: [],  //壁画图
    level1: [],//一级分类
    level2: [],//二级分类 
    level1_index: 0,//一级分类id
  },
  //事件处理函数
  tap_change: function () {
    vm.setData({
      open: !vm.data.open
    })
    console.log("点击");
  },
  onLoad: function () {
    vm = this;
    vm.getADList(); //获取轮播图
    vm.getListlevel1();   //获取一级分类
  },
  //搜索跳转
  searchBH: function () {
    wx.navigateTo({
      url: "/pages/search/search"
    })
  },
  //点击tab
  tabClick: function (e) {
    //console.log("tabClick e:" + JSON.stringify(e));
    var level1_index = e.currentTarget.dataset.id;//肯定好使的查看数据地方
    vm.setData({
      level1_index: level1_index
    })
    var param = {
      level1_id: vm.data.level1[level1_index].id  //获取一级列表ID
    }
    vm.getListLevel2(param);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },


  //获取轮播图
  getADList: function () {
    util.getADList({}, function (res) {
      //console.log("getADList : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        //成功 则ad 被赋值得到的数据
        vm.setData({
          ad: res.data.ret
        })
        // console.log("data ad:"+JSON.stringify(vm.data.ad));
      } else {
        util.showToast(ret.data.message);
      }

    }, function () {
      console.log("错误回调")
    })
  },
 
  //获取一级分类
  getListlevel1: function () {
    util.getListlevel1({}, function (res) {
      //console.log("level1 : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        var msgObj = res.data.ret;
        msgObj.unshift(level1_all);
        vm.setData({
          level1: msgObj
        })
        //如果获取level1成功
        if (msgObj.length > 0) {
          var param = {
            level1_id: vm.data.level1[0].id
          }
          //console.log("paramm : " + JSON.stringify(param)) 
          vm.getListLevel2(param);
        }
      } 
    }, function () {
      console.log("错误回调")
    })
  }, 
  //根据level2获取其下方的壁画列表
  getListLevel2: function (param) {
   // console.log("getBihuasByLevel2 param:" + JSON.stringify(param));
    if (param.level1_id == 0) {
      delete param.level1_id;
    }
    console.log("after getBihuasByLevel2 param:" + JSON.stringify(param));
    util.getListLevel2(param, function (res) {
      console.log("level2 : " + JSON.stringify(res))
      vm.setData({
        level2: res.data.ret  //通过一级列表ID获取二级详情
      })
    })
  }, 
  showitem: function () {
    this.setData({
      open: !this.data.open
    })
  }, 
  // 点击跳转轮播图内容页
  click_lb: function (e) {
    // console.log("asdasd : " + JSON.stringify(e.currentTarget)) 
    wx.navigateTo({
      url: "/pages/looklb/looklb?id=" + e.currentTarget.dataset.id,
    })
  },
  // 点击跳转二级分类壁画内容页 
  click_twoxq: function (e) {
    var level2 = e.currentTarget.dataset.id;
    //console.log("twoxqid" + vm.data.level1_index);
    wx.navigateTo({
      url: "/pages/looktwoxq/looktwoxq?level2_id=" + level2,
    })
  },
  //分享
  onShareAppMessage: function () {  
    var title ="我分享给你的小程序看一下吧";
    var path = '/pages/index/index';
    return {
      title: title, 
      path: path
    }
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

});