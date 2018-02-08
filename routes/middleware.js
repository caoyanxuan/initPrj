/* eslint-disable */
const TEXT_CODE = require('./textCode.js');
/* eslint-enable */

/**
 * 生成json类型的返回码
 * @param { Number } code 响应码
 * @param { Stirng } message 返回的信息
 * @param { Object } data 返回的数据
 * @returns { Object } 返回json格式的响应
 */
exports.jsonMaker = (code = 0, message = '', data = {}) => {
    if (TEXT_CODE[code]) {
        return {
            code: Number(code),
            message: TEXT_CODE[code]
        }
    }
    return {
        code: Number(code),
        message: String(message),
        data: data
    }
}

/**
 * 生成分页数据
 * @param { Number } pageNum 当前页
 * @param { Number } pageSize 分页条数
 * @param { Number } total 总条数
 * @returns { Object } 分页数据
 */
exports.paginationMaker = (pageNum = 1, pageSize = 10, total = 0) => ({
        pageNum: Number(pageNum),
        pageSize: Number(pageSize),
        total: Number(total)
    })