//index.js
const app = getApp()
const {
  envList
} = require('../../envList.js')

Page({
  data: {
    query: '',
    addWordShow: false,
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    wordTrickObject: {
      type: 'add', // add, id,
      content: {}, // delta data
      title: ''
    },
    title: ''
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
    dialog.setData({
      show: false
    })
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

  handleAddWord() {
    this.setData({
      addWordShow: true
    })
  },


  beforeClose(action) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (action === 'confirm') {
          resolve(true);
          console.log(action)
        } else {
          // 拦截取消操作
          resolve(false);
          console.log(action)
        }
      }, 1000);
    })
  },


  onSearch(query) {
    const {
      detail
    } = query
    console.log(detail)
  },

  onCancel() {
    this.query = ''
  },

  changeTabs(e) {
    console.log(e)
  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index
    const powerList = this.data.powerList
    powerList[index].showItem = !powerList[index].showItem
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList)
    } else {
      this.setData({
        powerList
      })
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return
    }
    const powerList = this.data.powerList
    powerList.forEach(i => {
      i.showItem = false
    })
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    })
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    })
  },

  onPullDownRefresh(...args) {
    console.log(...args)
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        })
      }
      this.setData({
        powerList
      })
      wx.hideLoading()
    }).catch((e) => {
      console.log(e)
      this.setData({
        showUploadTip: true
      })
      wx.hideLoading()
    })
  }
})