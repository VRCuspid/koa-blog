var mysql = require('../mysql')
var acticle = require('./article')
module.exports = function(router) {
    router.get('/api/test',async (ctx)=>{
        var list = await mysql.query('SELECT * from acticle_list')
        var parmar = ctx.query
        console.log(parmar)
        console.log(list)
        ctx.body="首页";
    })

   // 新增文章
    router.post('/api/acticle/add_acticle',async (ctx)=>{
        const {act_title,main_content,act_detail,tags,likes} = ctx.request.body
        const data = await acticle.addAticle({act_title,main_content,act_detail,tags,likes})
        console.log(data,'data')
        ctx.body = data
    })

    // 分页查询文章列表
    router.get('/api/acticle/get_acticleList',async (ctx)=>{
        const { page,size } = ctx.query
        const data  = await acticle.searchList({page,size})
        ctx.body = data
    })

    // 获取文章详情
    router.get('/api/acticle/get_acticleDetail', async ctx=>{
        const { id } = ctx.query
        let data = await acticle.searchList({condition:'id="'+id+'"',isDetail:true})
        data.data = data.code ? data.data[0] : data.data
        ctx.body = data
    })
    // 删除
    router.delete('/api/acticle/del_acticle', async ctx=>{
        const { id } = ctx.query
        const data = await acticle.delArticle({id})
        ctx.body = data
    })

    // 修改
    router.post('/api/acticle/update_acticle',async ctx=>{
        const { act_title,main_content,act_detail,tags,likes,id } = ctx.request.body
        const data = await acticle.updateArticle({act_title,main_content,act_detail,tags,likes,id})
        ctx.body = data
    })
}