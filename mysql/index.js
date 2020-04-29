
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
            if (err) {
                console.log('数据库连接失败',err);
                reject(err)
            } else {
                connection.query(sql,(err,res)=>{
                    resolve(res)
                    connection.release()
                })
            }
        })
      })
       
    }
}
module.exports = new Mysql()