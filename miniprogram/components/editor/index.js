// components/editor/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    editorCtx: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onEditorReady() {
      const that = this
      console.log(JSON.stringify(wx.createSelectorQuery().select('#editor')))
      this.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
        console.log(that.editorCtx)
      }).exec()

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