/*
 * @Author: caoyx
 * @Description: 未登录状态的接口：1.注册； 2.登录；
 * @CreateDate: 2018-02-08 15:22:32
 */
const crypto = require('crypto');
const UserModel = require('../../models/user.js');
const { jsonMaker } = require('../middleware.js');

const funcs = {
    // 用户注册
    postRegister: (req, res) => {
        const { name, password_re, email } = req.body;
        let { password } = req.body;
        if (!(name && password && password_re && email)) {
            return res.json(jsonMaker(6000)); //参数错误
        }
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            return res.json(jsonMaker(20000)); //两次输入的密码不一致
        }
        //生成密码的 md5 值（不能提出去，否则：Error: Digest already called）
        const md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
        // 检查用户名是否已经存在
        UserModel.findOne({ name }, function (err, data) {
            if (err) {
                return res.json(jsonMaker(10000)); //数据库异常
            } else {
                if (data) {
                    return res.json(jsonMaker(20001)); //该用户已创建
                } else {
                    // 创建实例，并保存
                    const newUserEntity = new UserModel({
                        name,
                        password,
                        email
                    });
                    newUserEntity.save(function (err, user) {
                        if (err) {
                            return res.json(jsonMaker(10000)); //数据库异常
                        } else {
                            // req.session.user = user;//用户信息存入 session
                            return res.json(jsonMaker(200, '注册成功', { user }));
                        }
                    })
                }
            }
        })
    },
    // 用户登录
    postLogin: (req, res) => {
        const { name } = req.body;
        let { password } = req.body;
        if (!(name && password)) {
            return res.json(jsonMaker(6000)); //参数错误
        }
        //生成密码的 md5 值（不能提出去，否则：Error: Digest already called）
        const md5 = crypto.createHash('md5');
        password = md5.update(password).digest('hex');
        //检查用户是否存在
        UserModel.findOne({ name: name }, function (err, data) {
            if (err) {
                return res.json(jsonMaker(10000)); //数据库异常
            } else {
                if (!data) {
                    return res.json(jsonMaker(20002)); //用户名或密码错误
                } else if (password !== data.password) {
                    return res.json(jsonMaker(20002)); //用户名或密码错误
                } else {
                    //用户名密码都匹配后，将用户信息存入 session
                    req.session.user = data;
                    //成功登录,返回用户信息
                    return res.json(jsonMaker(200, '成功登录', { data }));
                }
            }
        })
    }
}
module.exports = [{
    method: 'post',
    url: '/notLogin/register', // 用户注册
    handler: funcs.postRegister
}, {
    method: 'post',
    url: '/notLogin/login', // 用户登录
    handler: funcs.postLogin
}];