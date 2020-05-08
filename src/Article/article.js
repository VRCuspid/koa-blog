var mysql = require('../mysql')
var msg = require('../msg')
const { v4: uuidv4 } = require('uuid')
const { formatDate,CreateSql } = require('../uitls')
class Article {
    // 新增
    addAticle ({act_title,main_content,act_detail,tags,likes}) {
        return new Promise( async (resolve,reject)=>{
            if (!act_title||!main_content||!act_detail) {
                resolve(msg.error(400))
            } else {
                const id = uuidv4()
                const create_time = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
                const actlist = {
                    table:'acticle_list',
                    list: [
                        { prop:'id',value:id },
                        { prop:'act_title',value:act_title },
                        { prop:'create_time',value:create_time },
                        { prop:'main_content',value:main_content },
                        { prop:'likes',value:likes },
                        { prop:'tags',value:tags },
                        { prop:'act_detail',value:act_detail },
                    ]
                }
                const act_list_sql = CreateSql.insert(actlist)
                let acticle_list = await mysql.query(act_list_sql)
                if (acticle_list.res) {
                    resolve(msg.success(null,'新增成功'))
                } else {
                    console.log(acticle_list,'文章列表新增失败')
                    resolve(msg.error(acticle_list.code))
                } 
            }
        })
    }

    // 查询
    searchList ({page,size,condition,isDetail}) {
        return new Promise( async (resolve,reject) => {
            const keys = 'id,act_title,main_content,create_time,tags,likes,update_time'
            const act_list_sql = CreateSql.select({table:'acticle_list',limit:{ page,size },condition,keys:isDetail?null:keys})
            const act_list = await mysql.query(act_list_sql)
            if (isDetail) {
                resolve(act_list.data.length?msg.success(act_list.data):{code:0,msg:'该文章不存在',res:false})
                return
            }
            resolve(
                act_list.res ? 
                msg.success(act_list.data) :
                msg.error(act_list.code)
            )
        })
    }

    // 删除
    delArticle({id}) {
        return new Promise( async (resolve,reject) => {
            const del_sql = CreateSql.delete({table:'acticle_list',condition:`id="${id}"`})
            const act_del = await mysql.query(del_sql)
            resolve(
                act_del.res ?
                msg.success(null,'删除成功') :
                msg.error(act_del.code)
            )
        })
    }

    // 修改
    updateArticle({id,act_title,main_content,act_detail,tags,likes}) {
        const update_time = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
        const updateObj = {
            table:'acticle_list',
            updatelist: [
                { prop:'act_title',value:act_title },
                { prop:'update_time',value:update_time },
                { prop:'main_content',value:main_content },
                { prop:'likes',value:likes },
                { prop:'tags',value:tags },
                { prop:'act_detail',value:act_detail },
            ],
            condition:'id="'+id+'"'
        }
        return new Promise( async (resolve,reject) => {
            const update_sql = CreateSql.update(updateObj)
            const act_upadte = await mysql.query(update_sql)
            if (act_upadte.res) {
                const act_detail = await this.searchList({condition:'id="'+id+'"',isDetail:true})
                console.log(act_detail,'detail')
                resolve(
                    msg.success(act_detail.data[0],'更新成功')
                )
            } else {
                resolve({code:0,res:false,msg:'修改失败'})
            }
            console.log(update_sql)
            resolve({code:1})
        })
    }

}

module.exports = new Article()