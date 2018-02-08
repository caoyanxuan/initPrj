var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var settings = require('./settings');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var app = express();
app.set('port', settings.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
	secret: settings.cookieSecret,
	key: settings.db,//cookie name
	cookie: { maxAge: 1000 * 60 * 60 },//1 hour
	store: new MongoStore({
		db: settings.db,
		host: settings.host,
		url: settings.url,
	})
}));

routes(app);

app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;