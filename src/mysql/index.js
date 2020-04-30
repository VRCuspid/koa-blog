
var mysql = require('mysql')
var config = require('./config')
var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});

class Mysql {
    constructor () {

    }
    query (sql) {
      if (!sql) {
          throw 'sql语句为空'
      }
      return new Promise((resolve, reject) => {
        pool.getConnection((err,connection)=>{
            let response = {}
            if (err) {
                console.log('数据库连接失败',err);
                resolve({ code:500,msg:'数据库连接失败',err,res:true})
            } else {
                connection.query(sql,(error,res)=>{
                    if (error) {
                      console.log(error)
                      resolve({code:501,msg:'数据库操作失败',error})
                      return
                    }
                    resolve({code:1,msg:'操作成功',data: res, res: true})
                    connection.release()
                })
            }
        })
      })
    }
}
module.exports = new Mysql()