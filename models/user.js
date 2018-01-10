/*
 * @Author: caoyx
 * @Description: 操作用户信息的数据库，增删查改
 * @CreateDate: 2018-01-08 10:56:18
 */

var Db = require('./db');
var mongoose = require('mongoose');

// 1.创建Schema
var UserSchema = new mongoose.Schema({
    name: {type:String},
    password: {type:String},
    email: {type:String},
    portrait: {type:String, default:'/images/default.png'},
    time: {type:Date, default:Date.now},
});

// 2.创建模型
var UserModel = Db.model("users",UserSchema);

module.exports = UserModel;