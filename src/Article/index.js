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

    /**
     * 新增
     */
    router.post('/api/acticle/add_acticle',async (ctx)=>{
        const {act_title,main_content,act_detail,tags,likes} = ctx.request.body
        const data = await acticle.addAticle({act_title,main_content,act_detail,tags,likes})
        console.log(data,'data')
        ctx.body = data
    })

    router.get('/api/acticle/get_acticlelist',async (ctx)=>{
        const {page,size} = ctx.query
        console.log(page,size,'page,size')
        
        ctx.body = {
            code: 1,
            data: null
        }
    })
}