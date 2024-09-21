const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const MongoStore = require('connect-mongo')
const secret = 'imooc';


var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors(
 {
  origin: 'http://localhost:8080',  // 前端的域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // 允许携带 cookie
 }
));
// 设置 session
app.use(session({
  secret: 'itlike',  // 设置自己的 secret
  name:'likeid',//返回客户端key的名称，默认为connect_sid
  resave:false,//强制保存session，即使它没有变化
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: 'mongodb://127.0.0.1:27017/app',
    autoReconnect: true
  }),
  cookie: {
    httpOnly: true,
    maxAge: 600000,  // 10 分钟
    sameSite: 'None',  // 允许跨域请求
    secure: false,      // 开发环境下设置为 false，生产环境需要设置为 true
  }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);

app.options('*', cors());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
