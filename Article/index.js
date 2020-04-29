var mysql = require('../mysql')

module.exports = function(router) {
    router.get('/api/test',async (ctx)=>{
        var list = await mysql.query('SELECT * from acticle_list')
        var parmar = ctx.query
        console.log(parmar)
        console.log(list)
        ctx.body="首页";
    })
}