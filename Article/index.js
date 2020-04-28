module.exports = function(router) {
    router.get('/api/test',async (ctx)=>{
        ctx.body="首页";
    })
}