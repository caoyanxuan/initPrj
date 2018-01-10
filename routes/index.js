var crypto = require('crypto');
var Db = require('../models/db.js');
var UserModel = require('../models/user.js');
var PostModel = require('../models/post.js');

module.exports = function (app) {
	// 主页

	app.get('/', function (req, res) {
		PostModel.find({
			name: req.session.user ? req.session.user.name : ''
		}, function (err, postsArr) {
			if (err) {
				postsArr = [];
			} else {
				res.render('index', {
					title: '天天博客',
					user: req.session.user,
					posts: postsArr,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				});
			}
		})
	});

	// 注册
	app.get('/reg', checkNotLogin);
	app.get('/reg', function (req, res) {
		res.render('reg', {
			title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/reg', checkNotLogin);
	app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//检验用户两次输入的密码是否一致
		if (password_re != password) {
			req.flash('error', '两次输入的密码不一致!');
			return res.redirect('/reg');//返回注册页
		}
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		// 检查用户名是否已经存在
		UserModel.findOne({ name: name }, function (err, data) {
			if (err) {
				req.flash('error', data);
				return res.redirect('/');
			} else {
				if (data) {
					req.flash('error', '用户已存在!');
					return res.redirect('/reg');//返回注册页
				} else {
					// 创建实例，并保存
					var newUserEntity = new UserModel({
						name: name,
						password: password,
						email: req.body.email
					});
					newUserEntity.save(function (err, user) {
						if (err) {
							req.flash('error', user);
							return res.redirect('/');
						} else {
							req.session.user = user;//用户信息存入 session
							req.flash('success', '注册成功!');
							return res.redirect('/');//注册成功后返回主页
						}
					})
				}
			}
		})
	});

	// 登录
	app.get('/login', checkNotLogin);
	app.get('/login', function (req, res) {
		res.render('login', {
			title: '登录',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function (req, res) {
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		//检查用户是否存在
		UserModel.findOne({ name: req.body.name }, function (err, data) {
			if (err) {
				req.flash('error', data);
				return res.redirect('/');
			} else {
				if (!data) {
					req.flash('error', '用户不存在!');
					return res.redirect('/login');
				} else if (password !== data.password) {
					req.flash('error', '密码错误!');
					return res.redirect('/login');
				} else {
					//用户名密码都匹配后，将用户信息存入 session
					req.session.user = data;
					req.flash('success', '登陆成功!');
					return res.redirect('/');//登陆成功后跳转到主页
				}
			}
		})
	});

	// 登出
	app.get('/logout', checkLogin);
	app.get('/logout', function (req, res) {
		req.session.user = null;
		req.flash('success', '登出成功!');
		res.redirect('/');
	});

	// 发版
	app.get('/post', checkLogin);
	app.get('/post', function (req, res) {
		res.render('post', {
			title: '发表',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/post', checkLogin);
	app.post('/post', function (req, res) {
		var NewPostEntity = new PostModel({
			name: req.session.user.name,
			title: req.body.title,
			post: req.body.post
		})
		NewPostEntity.save(function (err, postData) {
			if (err) {
				req.flash('error', postData);
				return res.redirect('/post');
			} else {
				return res.redirect('/');
			}
		})
	});

	// 账户
	app.get('/account', checkLogin);
	app.get('/account', function (req, res) {
		res.render('account', {
			title: '账户',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/post', checkLogin);
	app.post('/post', function (req, res) {
		// var NewPostEntity = new PostModel({
		// 	name: req.session.user.name,
		// 	title: req.body.title,
		// 	post: req.body.post
		// })
		// NewPostEntity.save(function (err, postData) {
		// 	if (err) {
		// 		req.flash('error', postData);
		// 		return res.redirect('/post');
		// 	} else {
		// 		return res.redirect('/');
		// 	}
		// })
	});

	// 检查用户是否登录的中间件，用于权限控制
	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录!');
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录!');
			res.redirect('back');
		}
		next();
	}
};