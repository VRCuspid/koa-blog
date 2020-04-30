class Msg {
    success(data,msg) {
        return { code: 1,res:true,data,status: 200,msg:msg||'操作成功' }
    }
    error(code) {
        const msg = {
            400: '参数缺失',
            500: '数据库连接失败',
            501: '数据库操作失败'
        }
        return { code: 0,res: false,data:null, message:msg[code]||'网络有误' }
    }
}

module.exports = new Msg()