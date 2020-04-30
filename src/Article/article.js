var mysql = require('../mysql')
var msg = require('../msg')
const { v4: uuidv4 } = require('uuid')
const { formatDate,CreateSql } = require('../uitls')
class Article {
    addAticle ({act_title,main_content,act_detail,tags,likes}) {
        return new Promise( async (resolve,reject)=>{
            if (!act_title||!main_content) {
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
                    ]
                }
                const actdetail = {
                    table:'act_detail',
                    list: [
                        { prop:'id',value:id },
                        { prop:'act_detail',value:act_detail },
                    ]
                }
                const act_list_sql = CreateSql.insert(actlist)
                const act_detail_sql = CreateSql.insert(actdetail)
                let acticle_list = await mysql.query(act_list_sql)
                let acticle_detail = await mysql.query(act_detail_sql)
                if (acticle_list.res&&acticle_detail.res) {
                    resolve(msg.success({},'新增成功'))
                } else if(!acticle_list.res) {
                    console.log(acticle_list,'文章列表新增失败')
                    resolve(msg.error(acticle_list.code))
                } else if (!acticle_detail.res) {
                    console.log(acticle_detail,'新增文章详情失败')
                    resolve(msg.error(acticle_detail.code))
                }
            }
        })
    }

    searchList ({page,size,condition}) {
        return new Promise( async (resolve,reject) => {
            const act_list_sql = CreateSql.search('acticle_list',{ page,size },condition)
            const act_list = await mysql.query('SELECT * FROM acticle_list')
            resolve(
                act_list.res ? 
                msg.success(act_list.data) :
                msg.error(act_list.code)
            )
        })
    }

}

module.exports = new Article()