class Msg {
    success(data,msg) {
        return { code: 1,res:true,data,status: 200,msg:msg||'操作成功' }
    }
    error(code) {
        const msg = {
            400: '参数有误',
            500: '数据库连接失败',
            501: '数据库操作失败',
            4004: '用户不存在',
            4003: '密码错误',
            4004: '认证信息失效，请重新登录'
        }
        return { code: 0,res: false,data:null, message:msg[code]||'网络有误' }
    }
}

module.exports = new Msg()