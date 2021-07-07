// components/customTabBar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageIndex: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageList: [{
      icon: "comment-o",
      label: "话术"
      },
      {
        icon: "user-circle-o",
        label: "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      // this.setData({ active: event.detail })
      wx.showToast({
        title: `点击标签 ${event.detail + 1}`,
        icon: 'none',
      });
      if (event.detail === 0) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      if (event.detail === 1) {
        wx.switchTab({
          url: '/pages/sellWord/index',
        })
      }
    }
  },

  show() {
    console.log('page', getCurrentPages()[0].route)
  }
})