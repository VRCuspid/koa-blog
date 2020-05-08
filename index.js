var router = require('koa-router')();  /*引入是实例化路由** 推荐*/
var Koa = require('koa')
var PORT = 3001
var app=new Koa();
var bodyParser = require('koa-bodyparser');
var auth = require('./src/Auth/auth')
var msg = require('./src/msg')

router.get('/',async (ctx)=>{
    ctx.body="首页";
    console.log(ctx.request.headers)
})

app.use(bodyParser())   /* 获取POST方式参数 */

app.use(async (ctx,next)=> {
    const { authorization } = ctx.request.headers
    try {
        const keyArr = auth.deToken(authorization).split('&')
        if (keyArr[0]&&keyArr[1]) {
            const [user_name,user_pwd] = keyArr
            const login_res = await auth.login({user_name,user_pwd})
            if (login_res.res) {
                await next()
            } else {
                throw '4004'
            }
        } else {
            throw '4004'
        }
    } catch(err) {
        console.log(err)
        ctx.body = msg.error(4004)
    }
    
})

app.use(router.routes());   /*启动路由*/

/*
 * router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
 * 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
 * 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头 
 *
 */
app.use(router.allowedMethods());

require('./src/Article')(router)
require('./src/Auth')(router)

app.listen(PORT,()=>{
    console.log('服务器启动成功，端口号：'+PORT,)
});
