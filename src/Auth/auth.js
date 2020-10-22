var mysql = require('../mysql')
var msg = require('../msg')
const { v4: uuidv4 } = require('uuid')
const { formatDate,CreateSql } = require('../uitls')
const crypto = require('crypto');
const svgCaptcha = require('svg-captcha')
const { secret } = require('../secret');
const encryption = require('../uitls/encryption');
const { deprecate } = require('util');

class Auth {
    login({user_name,user_pwd}) {
        const _t = this
        return new Promise(async resolve=>{
            if (!user_name) {
                resolve({code:0,res:false,data:null,msg:'账户名为空'})
                return
            }
            const login_sql = CreateSql.select({table:'user',condition:'user_name="'+user_name+'"'})
            const login_res = await mysql.query(login_sql)
            if (login_res.res) {
                const { data } = login_res
                const token = _t.createToken({user_name,user_pwd})
                resolve(
                    data[0] ?
                        data[0].user_pwd === user_pwd ?
                            msg.success({token},'登录成功') :
                            msg.error(4003) :
                        msg.error(4004)
                )
            } else {
                console.log(login_res.code,'login_res.code')
                resolve(msg.error(login_res.code))
            }
        })
    }

    createToken({user_name,user_pwd}) {
        const algorithm = 'aes-192-cbc';
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(secret, secret, 24);
        // 使用 `crypto.randomBytes()` 生成随机的 iv 而不是此处显示的静态的 iv。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(user_name+'&'+user_pwd, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        this.deToken(encrypted)
        return encrypted
    }

    deToken(token) {
        const algorithm = 'aes-192-cbc';
        // 改为使用异步的 `crypto.scrypt()`。
        const key = crypto.scryptSync(secret, secret, 24);
        // IV 通常与密文一起传递。
        const iv = Buffer.alloc(16, 0); // 初始化向量。

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        // 使用相同的算法、密钥和 iv 进行加密。
        
        let decrypted = decipher.update(token, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted
    }

    code() {
        let cap = svgCaptcha.create({
            size:6,
            ignoreChars:'0o1i',
            noise:2,
        });
        var decrypted = encryption.encrypt(cap.text)
        var data = {
            svg: cap.data,
            code: decrypted[0],
            iv: decrypted[1],
            authTag: decrypted[2]
        }

        return msg.success(data)
        // console.log(encryption.decrpt(...decrypted))

    }


}

module.exports = new Auth()