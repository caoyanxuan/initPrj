/*
 * @Author: caoyx
 * @Description: 连接到数据库
 * @CreateDate: 2018-01-05 18:55:57
 */

var settings = require('../settings');
var mongoose = require('mongoose');

mongoose.connect(settings.url);
var Db = mongoose.connection;
Db.on('connected', console.error.bind(console, '连接成功'));
Db.on('error', console.error.bind(console, '连接失败'));
Db.on('disconnected', console.error.bind(console, '连接断开'));

module.exports = Db;