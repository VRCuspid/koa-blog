var mysql = require('../mysql')
var msg = require('../msg')
const { v4: uuidv4 } = require('uuid')
const { formatDate,CreateSql } = require('../uitls')
var urlencode = require('urlencode');
const Tag = require('../Tag/tag')
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
                        { prop:'act_detail',value:urlencode(act_detail, 'gbk')},
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
            const total_sql = CreateSql.getTotal({table:'acticle_list'})
            const act_list_total = await mysql.query(total_sql)
            const total = act_list_total.res ? act_list_total.data[0]['COUNT(*)'] : 0
            const keys = 'id,act_title,main_content,DATE_FORMAT(create_time,"%Y-%m-%d %T") as create_time,DATE_FORMAT(update_time,"%Y-%m-%d %T") as update_time,tags,likes'
            const act_list_sql = CreateSql.select({table:'acticle_list',limit:{ start:page*size,end:page*size+size },condition,keys:isDetail?null:keys})
            let act_list = await mysql.query(act_list_sql)
            if (isDetail) {
                if(act_list.data.length) {
                    var response = act_list.data[0]
                    response.act_detail = urlencode.decode(response.act_detail, 'gbk')
                    resolve(msg.success(response))
                } else {
                    resolve({code:0,msg:'该文章不存在',res:false})
                }
                return
            }
            resolve(
                act_list.res ? 
                msg.success({rows:act_list.data,total}) :
                msg.error(act_list.code)
            )
        })
    }

    // 删除
    delArticle({id}) {
        return new Promise( async (resolve,reject) => {
            const del_sql = CreateSql.delete({table:'acticle_list',condition:`id="${id}"`})
            const act_del = await mysql.query(del_sql)
            console.log(del_sql)
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
                { prop:'act_detail',value:urlencode(act_detail, 'gbk') },
            ],
            condition:'id="'+id+'"'
        }
        return new Promise( async (resolve,reject) => {
            const update_sql = CreateSql.update(updateObj)
            const act_upadte = await mysql.query(update_sql)
            if (act_upadte.res) {
                const act_detail = await this.searchList({condition:'id="'+id+'"',isDetail:true})
                resolve(
                    msg.success(act_detail.data[0],'更新成功')
                )
            } else {
                resolve({code:0,res:false,msg:'修改失败'})
            }
            resolve({code:1})
        })
    }

}

module.exports = new Article()