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
    },
    wordTrickId: String,
    wordData: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    editorCtx: {},
    title: '',
    content: {},
    currentUserId: ''
  },

  watch: {
    addWordShow: function (params) {
      if(params){
        if(this.data.wordTrickId !== 'add'){
          let {title, content} = (this.data.wordData || {})
          this.setData({
            title: title,
            content: content
          })
          this.editorCtx.setContents({...content})
        }else{
          this.setData({
            title: '',
            content: {}
          })
          this.editorCtx.setContents({delta: {}})
        }
      }
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

    getUserId() {
      return wx.getStorageSync('currentUserOpenId')
    },

    getUserInfo(event) {
      let dialog = event.detail.dialog
      let currentUserId = this.getUserId()
      let params = {
        content: this.data.content,
        userOpenId: currentUserId,
        title: this.data.title
      }
      console.log(params)
      if (this.data.wordTrickId === 'add') {
        params.opType = 'add'
      } else {
        params.opType = 'update'
        params.id = this.data.wordTrickId
      }
      console.log(params)
      let that = this
      wx.cloud.callFunction({
        name: 'modifyWord', // 云函数名称
        data: params, // 传给云函数的参数
        success: function ({
          result
        }) {
          console.log('操作成功', result)
          wx.nextTick(() => {
            dialog.setData({
              loading: {
                confirm: false,
                cancel: false
              }
            })
          })
          that.setData({
            addWordShow: false
          })
          that.triggerEvent('search', '')
        },
        fail: function (params) {
          wx.nextTick(() => {
            dialog.setData({
              loading: {
                confirm: false,
                cancel: false
              }
            })
          })
          console.error(params)
        }
      })
      // dialog.setData({show: false})
    },

    handleCloseDialog(event) {
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

    onEditorInput({
      detail
    }) {
      this.setData({
        content: detail
      })
    },

    clear() {
      this.editorCtx.clear({
        success: function (res) {}
      })
    },
  }
})