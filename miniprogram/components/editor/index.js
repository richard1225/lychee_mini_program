// components/editor/index.js
const computedBehavior = require('miniprogram-computed').behavior
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [computedBehavior],
  properties: {
    addWordShow: {
      type: Boolean,
      default: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    editorCtx: {},
    title: '',
    content: {}
  },

  watch: {
    addWordShow: function(params) {
      console.log('showaddword',params)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onEditorReady() {
      const that = this
      this.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
      }).exec()

    },

    getUserInfo(event) {
      console.log('userInfo;Get', event)
      let dialog = event.detail.dialog
      wx.nextTick(() => {
        setTimeout(_ => {
          dialog.setData({
            loading: {
              confirm: false,
              cancel: false
            }
          })
        }, 2000)
      })
      // dialog.setData({show: false})
    },

    handleCloseDialog(event) {
      console.log(event)
      let dialog = event.detail.dialog
      wx.nextTick(_ => {
        dialog.setData({
          loading: {
            confirm: false,
            cancel: false
          }
        })
      })
      this.setData({
        addWordShow: false
      })
    },

    onEditorInput({detail}){
      console.log(detail)
      this.setData({
        content: detail
      })
    },

    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    },
  }
})