const crypto = require('crypto');
const UserModel = require('../models/user.js');
const PostModel = require('../models/post.js');
const upload = require('../models/upload.js');
const glob = require('glob');
const { jsonMaker } = require('./middleware.js');

const instance = []; // 路由对象存储
const routesArr = []; // 路由名存储
// 获取routes下的路由模块文件名，routesArr {array}
glob.sync('routes/modules/*.js').forEach((currentFile) => {

	//组装出routes下的文件名，如：[ 'detail', 'index' ]
	const currentModule = currentFile.match(/routes\/modules\/(\S*)\.js/)[1];
	/* eslint-disable */
	// 导入/routes/moudules下的所有文件，push到instance数组
	instance.push(require(`./modules/${currentModule}`))
	/* eslint-enable */

	// 将/routes/moudules下的所有文件名push到routesArr
	routesArr.push(currentModule);
});

module.exports = (app) => {

	// 过滤器中间件
	app.use((req, res, next) => {
		let modelPath = '';
		if (req.url === '/') {
			// 根目录对应'home'页
			modelPath = 'home'
		} else {
			modelPath = req.url.split('/')[1];
		}
		// 验证登录状态
		if (routesArr.includes(modelPath)) {
			switch (modelPath) {
				case 'home': break;

				case 'notLogin':
					if (req.session.user) {
						return res.json(jsonMaker(10003)) //用户已登录
					}
					break;

				default:
					if (!req.session.user) {
						return res.json(jsonMaker(10002)); //用户未登录
					}
					break;
			}
		}
		next();
	})

	// 遍历生成路由。
	instance.forEach((insArr) => {
		insArr.forEach(({ method, url, handler }) => {
			app[method](url, handler);
		})
	})

	// 如果之前的路由匹配失败，则返回404
	app.use('*', (req, res) => {
		res.sendStatus(404).end();
	})
};





// // 主页
	// app.get('/', function (req, res) {
	// 	var nameObj = req.session.user ? { name: req.session.user.name } : null
	// 	PostModel.find(nameObj, function (err, postsArr) {
	// 		if (err) {
	// 			postsArr = [];
	// 		} else {
	// 			res.render('index', {
	// 				title: '天天博客',
	// 				user: req.session.user,
	// 				posts: postsArr, // {array} 发布的博客列表
	// 				success: req.flash('success').toString(),
	// 				error: req.flash('error').toString()
	// 			});
	// 		}
	// 	})
	// });

	// // 注册
	// app.get('/reg', checkNotLogin);
	// app.get('/reg', function (req, res) {
	// 	res.render('reg', {
	// 		title: '注册',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });
	// app.post('/reg', checkNotLogin);
	// app.post('/reg', function (req, res) {
	// 	var name = req.body.name,
	// 		password = req.body.password,
	// 		password_re = req.body['password-repeat'];
	// 	//检验用户两次输入的密码是否一致
	// 	if (password_re != password) {
	// 		req.flash('error', '两次输入的密码不一致!');
	// 		return res.redirect('/reg');//返回注册页
	// 	}
	// 	//生成密码的 md5 值
	// 	var md5 = crypto.createHash('md5');
	// 	password = md5.update(req.body.password).digest('hex');
	// 	// 检查用户名是否已经存在
	// 	UserModel.findOne({ name: name }, function (err, data) {
	// 		if (err) {
	// 			req.flash('error', data);
	// 			return res.redirect('/');
	// 		} else {
	// 			if (data) {
	// 				req.flash('error', '用户已存在!');
	// 				return res.redirect('/reg');//返回注册页
	// 			} else {
	// 				// 创建实例，并保存
	// 				var newUserEntity = new UserModel({
	// 					name: name,
	// 					password: password,
	// 					email: req.body.email
	// 				});
	// 				newUserEntity.save(function (err, user) {
	// 					if (err) {
	// 						req.flash('error', user);
	// 						return res.redirect('/');
	// 					} else {
	// 						req.session.user = user;//用户信息存入 session
	// 						req.flash('success', '注册成功!');
	// 						return res.redirect('/');//注册成功后返回主页
	// 					}
	// 				})
	// 			}
	// 		}
	// 	})
	// });

	// // 登录
	// app.get('/login', checkNotLogin);
	// app.get('/login', function (req, res) {
	// 	res.render('login', {
	// 		title: '登录',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });
	// app.post('/login', checkNotLogin);
	// app.post('/login', function (req, res) {
	// 	//生成密码的 md5 值
	// 	var md5 = crypto.createHash('md5'),
	// 		password = md5.update(req.body.password).digest('hex');
	// 	//检查用户是否存在
	// 	UserModel.findOne({ name: req.body.name }, function (err, data) {
	// 		if (err) {
	// 			req.flash('error', data);
	// 			return res.redirect('/');
	// 		} else {
	// 			if (!data) {
	// 				req.flash('error', '用户不存在!');
	// 				return res.redirect('/login');
	// 			} else if (password !== data.password) {
	// 				req.flash('error', '密码错误!');
	// 				return res.redirect('/login');
	// 			} else {
	// 				//用户名密码都匹配后，将用户信息存入 session
	// 				req.session.user = data;
	// 				req.flash('success', '登陆成功!');
	// 				return res.redirect('/');//登陆成功后跳转到主页
	// 			}
	// 		}
	// 	})
	// });

	// // 登出
	// app.get('/logout', checkLogin);
	// app.get('/logout', function (req, res) {
	// 	req.session.user = null;
	// 	req.flash('success', '登出成功!');
	// 	res.redirect('/');
	// });

	// // 发表
	// app.get('/post', checkLogin);
	// app.get('/post', function (req, res) {
	// 	res.render('post', {
	// 		title: '发表',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });
	// app.post('/post', checkLogin);
	// app.post('/post', function (req, res) {
	// 	var NewPostEntity = new PostModel({
	// 		name: req.session.user.name,
	// 		portrait: req.session.user.portrait,
	// 		title: req.body.title,
	// 		post: req.body.post
	// 	})
	// 	NewPostEntity.save(function (err, postData) {
	// 		if (err) {
	// 			req.flash('error', postData);
	// 			return res.redirect('/post');
	// 		} else {
	// 			return res.redirect('/');
	// 		}
	// 	})
	// });

	// // 上传
	// app.get('/upload', checkLogin);
	// app.get('/upload', function (req, res) {
	// 	res.render('upload', {
	// 		title: '账户',
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });

	// app.post('/upload', checkLogin);
	// // upload.array('img',5),可实现多文件上传，PS:第一个参数必须和input的name相同
	// app.post('/upload', upload.array('img', 1), function (req, res, next) {
	// 	// 判断是否选择了文件
	// 	if (req.files.length === 0) {
	// 		req.flash('error', '请选择图片上传');
	// 		return res.redirect('/upload');
	// 	}

	// 	// 判断文件格式是否为图片
	// 	if (req.files[0].mimetype.indexOf('image') === -1) {
	// 		req.flash('error', '上传类型为图片');
	// 		return res.redirect('/upload');
	// 	}

	// 	// 上传到服务器
	// 	var targetName = { name: req.session.user.name };
	// 	var updatePortrait = { portrait: req.files[0].path };
	// 	if (res) {
	// 		UserModel.update(targetName, updatePortrait, function (error) {
	// 			if (error) {
	// 				req.flash('error', error);
	// 				return res.redirect('/');
	// 			} else {
	// 				req.session.user.portrait = req.files[0].path;
	// 				req.flash('success', '文件上传成功!');
	// 				res.redirect('/')
	// 			}
	// 		});
	// 	}
	// })

	// // 文章详情页
	// app.get('/detail', checkLogin);
	// app.get('/detail/:id', function (req, res) {
	// 	// console.log('window.location', window.location);
	// 	res.render('detail', {
	// 		title: '文章详情',
	// 		id: req.params.id,
	// 		user: req.session.user,
	// 		success: req.flash('success').toString(),
	// 		error: req.flash('error').toString()
	// 	});
	// });
