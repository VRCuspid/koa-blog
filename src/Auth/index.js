var auth = require('./auth')
module.exports = function(router) {
    router.post('/api/auth/login',async (ctx)=>{
        const { user_name,user_pwd } = ctx.request.body
        const data = await auth.login({ user_name,user_pwd })
        console.log(data,'data')
        ctx.body = data;
    })

}