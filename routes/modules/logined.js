/*
 * @Author: caoyx
 * @Description: 已登录状态的非业务接口：1.登出
 * @CreateDate: 2018-02-08 15:25:28
 */
const crypto = require('crypto');
const UserModel = require('../../models/user.js');
const { jsonMaker } = require('../middleware.js');

const funcs = {
    // 登出
    getLogout: (req, res) => {
        req.session.user = null;
        return res.json(jsonMaker(200, '成功登出')); //成功登出
    },
    // 用户信息修改（当前只修改密码）
    postUserUpdate: (req, res) => {
        const { password_re } = req.body;
        const { name } = req.session.user;
        let { password } = req.body;
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            return res.json(jsonMaker(20000)); //两次输入的密码不一致
        }
        //生成密码的 md5 值（不能提出去，否则：Error: Digest already called）
        const md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex'); // md5加密
        UserModel.update({ name }, { password }, function (error) {
            if (error) {
                return res.json(jsonMaker(10000)); //数据库异常
            } else {
                req.session.user = null;
                return res.json(jsonMaker(200, '密码修改成功，请重新登录')); //密码修改成功
            }
        });
    }
}
module.exports = [{
    method: 'get',
    url: '/logined/logout', // 登出
    handler: funcs.getLogout
}, {
    method: 'post',
    url: '/logined/userUpdate', // 用户信息修改（当前只修改密码）
    handler: funcs.postUserUpdate
}];