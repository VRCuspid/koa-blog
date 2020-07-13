var mysql = require('../mysql')
var msg = require('../msg')
const { v4: uuidv4 } = require('uuid')
const { formatDate,CreateSql } = require('../uitls')
var urlencode = require('urlencode');

class Tag {
    addTag({tag_name,tag_color}) {
        return new Promise(async (resolve)=>{
            if(!tag_name||!tag_color) {
                resolve(msg.error(400))
            } else {
                const tag_id = uuidv4()
                const create_time = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
                const taglist = {
                    table:'tag',
                    list: [
                        { prop:'tag_id',value:tag_id },
                        { prop:'tag_name',value:tag_name },
                        { prop:'tag_color',value:tag_color },
                        { prop:'create_time',value:create_time },
                    ]
                }
                const tag_list_sql = CreateSql.insert(taglist)
                const tag_list = await mysql.query(tag_list_sql)
                if(tag_list.res) {
                    resolve(msg.success(null,'新增成功'))
                } else {
                    resolve(msg.error(tag_list.code))
                }
            }

        })
    }
    delTag({tag_id}){
        return new Promise(async (resolve)=>{
            if(!tag_id) {
                resolve(msg.error(400))
            } else {
                const deltag_sql = CreateSql.delete({table:'tag',condition:`tag_id="${tag_id}"`})
                const deltag_response = await mysql.query(deltag_sql)
                resolve(
                    deltag_response.res ?
                    msg.success(null,'删除成功') :
                    { code: 0,res: false,data:null, message:'删除失败' }
                )
            }
        })
    }
    selectTag({page,size,condition,isDetail}) {
        return new Promise(async resolve=>{
            const total_sql = CreateSql.getTotal({table:'tag'})
            const query_response = await mysql.query(total_sql)
            const total = query_response.res ? query_response.data[0]['COUNT(*)'] : 0

            const keys = 'tag_id,tag_name,tag_color,create_time,update_time'
            const taglist_sql = CreateSql.select({limit:{start:page*size,end:page*size+size},table:'tag',condition,keys})
            const taglist = await mysql.query(taglist_sql)

            if (isDetail) {
                console.log(taglist_sql)
                if(taglist.data.length) {
                    var response = taglist.data[0]
                    resolve(msg.success(response))
                }else {
                    resolve({code:0,msg:'该标签不存在',res:false})
                }
                return
            }

            resolve(
                taglist.res ? 
                msg.success({rows:taglist.data,total}) :
                msg.error(taglist.code)
            )

        })
    }
    upadteTag({tag_id,tag_color,tag_name}) {
        return new Promise(async (resolve) => {
            if(!tag_id) {
                resolve(msg.error(400))
            } else {
                const update_time = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
                const updateObj = {
                    table:'tag',
                    updatelist: [
                        { prop:'tag_name',value:tag_name },
                        { prop:'update_time',value:update_time },
                        { prop:'tag_color',value:tag_color },
                    ],
                    condition:'tag_id="'+tag_id+'"'
                }

                const update_sql = CreateSql.update(updateObj)
                const tag_update = await mysql.query(update_sql)
                resolve(
                    tag_update.res ?
                        msg.success(null,'修改成功') :
                        { code:0,res:false,msg:'修改失败' }
                )
            }

        })
    }
}

module.exports = new Tag()