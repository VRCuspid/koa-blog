var auth = require('./auth')
var greenNodejs = require('../uitls/green')
module.exports = function(router) {
    router.post('/api/auth/login',async (ctx)=>{
        const { user_name,user_pwd } = ctx.request.body
        const data = await auth.login({ user_name,user_pwd })
        console.log(data,'data')
        ctx.body = data;
    })

    router.post('/api/green',async ctx=>{
        // const {bizCfg} = ctx.request.body
        const accessKeyId = '<your accessKeyId>';
            const accessKeySecret = '<your accessKeySecret>';
            const greenVersion = '2017-01-12';
            var hostname = 'green.cn-shanghai.aliyuncs.com';
            var path = '/green/text/scan';

            var clientInfo = {
                "ip":"127.0.0.1"
            };


            // 请求体,根据需要调用相应的算法
            var requestBody = JSON.stringify({  
                bizType:'Green',
                scenes:['porn'],
                tasks:[{
                    'dataId':new Date()*1,
                    'content':'你好'
                }]
            }); 

            var bizCfg = {
                'accessKeyId' : accessKeyId,
                'accessKeySecret' : accessKeySecret,
                'path' : path,
                'clientInfo' : clientInfo,
                'requestBody' : requestBody,
                'hostname' : hostname,
                'greenVersion' : greenVersion
            }
        if(bizCfg) {
            greenNodejs(bizCfg,(chunk)=>{
                ctx.body = chunk
            })
        } else {
            ctx.body = {code:0}
        }
    })

}