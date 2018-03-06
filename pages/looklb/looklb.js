// pages/looklb/looklb.js
var util = require('../../utils/util.js')
var vm = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getById: [],//轮播详情
    id: '',
    image: [],
    imgList: [],   //图片集
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options"+JSON.stringify(options.id)) 
    vm = this
    vm.setData({
      id: options.id
    })
    vm.getById()
    wx.setNavigationBarTitle({
      title: '轮播详情'
    })
  },
  //获取轮播图详情
  getById: function () {
    var param = {
      id: vm.data.id
    }
    //  console.log("parama : " + JSON.stringify(param)) 
    util.getById(param, function (res) {
      console.log("getById : " + JSON.stringify(res))
      if (res.data.code == "200" && res.data.result == true) {
        console.log("getByIda:" + JSON.stringify(res.data));
        vm.setData({
          getById: res.data
        })

        vm.isImage()
        //console.log("data ad:"+JSON.stringify(vm.data));
      } else {
        // util.showToast(ret.data.message);
      }

    }, function () {
      console.log("错误回调")
    })
  },
  //判断图片
  isImage: function () {
    var imgList = []
    var tw_List = vm.data.getById.ret.tw_steps; //包含图片的数组
    for (var i = 0; i < tw_List.length; i++) {
      var imgIndex = tw_List[i].img
      if (imgIndex != null) {
        imgList.push(imgIndex)
      }  
    }
    console.log("图片集" + JSON.stringify(imgList))//轮播详情的 点的单个图片id    
    vm.setData({ imgList: imgList })
  },


  //图片点击事件 
  clickImage: function (e) {
    var tw_steps = vm.data.getById.ret.tw_steps//包含所有数据的数组
    var index = e.target.dataset.index; //点的单个图片索引
    var image = []//定义存放点击图片的空数组
    var img = tw_steps[index].img//点击图片的链接
    image.push(img)
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: image    // 需要预览的图片http链接列表
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