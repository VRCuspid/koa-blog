const strRepeat = function (s, count) {
    if (s == null) {
      throw new TypeError('can\'t convert ' + s + ' to object')
    }
    let str = '' + s
    count = ~~count
    if (count !== ~~count) {
      count = 0
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative')
    }
    if (count === Infinity) {
      throw new RangeError('repeat count must be less than infinity')
    }
    count = Math.floor(count)
    if (str.length === 0 || count === 0) {
      return ''
    }
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size')
    }
    let rpt = ''
    for (; ;) {
      if ((count & 1) === 1) {
        rpt += str
      }
      count >>>= 1
      if (count === 0) {
        break
      }
      str += str
    }
    return rpt
  }
  
  // padStart()方法的polyfill
  const padStart = function (str, targetLength, padString) {
    // 截断数字或将非数字转换为0
    targetLength = targetLength >> 0
    padString = String((typeof padString !== 'undefined' ? padString : ' '))
    if (str.length > targetLength || padString === '') {
      return String(str)
    }
    targetLength = targetLength - str.length
    if (targetLength > padString.length) {
      // 添加到初始值以确保长度足够
      padString += strRepeat(padString, targetLength / padString.length)
    }
    return padString.slice(0, targetLength) + String(str)
  }
  
  /**
   *
   * @param {Number,String,Date} date 需要转换的时间(同 new Date 参数一致))
   * @param {String} fmt 转换格式
   */
 const formatDate = (date, fmt) => {
    let time = new Date(date)
    if ((typeof date === 'string' && !date) || isNaN(time.getTime())) {
      console.warn('formatDate函数 警告: 无效参数', date)
      return ''
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'Y+': time.getFullYear(),
      'M+': time.getMonth() + 1,
      'd+': time.getDate(),
      'h+': time.getHours(),
      'm+': time.getMinutes(),
      's+': time.getSeconds(),
      'ms': time.getMilliseconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padStart(str, 2, '0'))
      }
    }
    return time.getTime() ? fmt : ''
  }

class CreateSql {
    insert({list,table}) {
        let valuearr = []
        let proparr = []
        list.forEach(item=>{
            if (item.value) {
                valuearr.push(`'${item.value}'`)
                proparr.push(item.prop)
            }
        })
        return `INSERT INTO ${table}(${proparr.join(',')}) VALUES(${valuearr.join(',')})`
    }

    select({table,limit,condition,keys}) {
        return `SELECT ${keys?keys:'*'} FROM ${table} ${condition?'WHERE ' +condition:''} ${limit&&limit.page&&limit.size?'LIMIT '+limit.page+','+limit.size:''}`
    }

    delete({table,condition}) {
        return `DELETE FROM ${table} WHERE ${condition}`
    }

    update({table,condition,updatelist}) {
        const set = updatelist.map(item=>{
          return `${item.prop}=${item.value?'"'+item.value+'"':null}`
        })

        return `UPDATE ${table} SET ${set.join(',')} WHERE ${condition}`
    }

}
module.exports = { formatDate,CreateSql:new CreateSql() }