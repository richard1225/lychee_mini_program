// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let { opType, id, title, query, content, userOpenId } = event
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  let result = {}
  switch (opType) {
    case 'search':
      const _ = db.command
      result = await db.collection('sellWord')
      .where(_.or([{
          title: db.RegExp({ regexp: `.*${query}`, options: 'i' })
        },
        {
          'content.text': db.RegExp({ regexp: `.*${query}`, options: 'i' })
        }
      ])).get().then(res => {
        return res.data
      })
      break;
    case 'add':
      const dataToAdd = {
        createBy: userOpenId,
        createTime: new Date(),
        title: title,
        content: content,
      }
      result = await db.collection('sellWord').add({
        data: dataToAdd
      }).then(res => {
        return res
      })
      break;
    case 'update':
      result = await db.collection('sellWord').doc(id).update({
        data: {
          title: title,
          content: content,
          updateTime: new Date(),
          updateBy: userOpenId
        },
      }).then(_=>_)
      break;
    case 'delete':
      result = await db.collection('sellWord').doc(id).remove().then(_=>_)
      break;
    case 'getById':
      result = await db.collection('sellWord').doc(id).get().then(res=>{
        return res.data
      })
      break
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    result: result
  }
}