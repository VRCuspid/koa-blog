'use strict';

const crypto = require('crypto');

const aes256gcm = key => {
  const ALGO = 'aes-256-gcm'; // 加密算法和操作模式

  const encrypt = str => {
    const iv = new Buffer.from(crypto.randomBytes(16), 'utf8').toString(); // 初始向量，16 字节
    const cipher = crypto.createCipheriv(ALGO, key, iv);        // 初始化加密算法
    let enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return [ enc, iv, cipher.getAuthTag() ];
  };

  // decrypt decodes base64-encoded ciphertext into a utf8-encoded string
  const decrpt = (enc, iv, authTag) => {
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
    let str = decipher.update(enc, 'hex', 'utf8');
    str += decipher.final('utf8');
    return str;
  };

  return { encrypt, decrpt };
};

// 加密密钥
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
const KEY = new Buffer.from(crypto.randomBytes(32), 'utf8');

const aesCipher = aes256gcm(KEY);

module.exports = aesCipher
// // 加密
// const [ encrypted, iv, authTag ] = aesCipher.encrypt('hello world');
// // 解密
// const decrypted = aesCipher.decrpt(encrypted, iv, authTag);

// console.log(decrypted); // hello world