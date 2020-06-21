var createError = require('http-errors');//http错误模块
var express = require('express'); //express模块
var path = require('path');       //node自带的路径模块
var cookieParser = require('cookie-parser');  //处理cookies
var logger = require('morgan');       //记录服务日志

var session = require("express-session");//自加

//数据库连接
var connection = require("./utils/connect")

//引入ws模块文件
require("./utils/webSocketServer");



//路由模块
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment')
var vueRouter= require('./routes/vue');
var reactRouter = require('./routes/react');

var cors = require("cors");  //cors解决跨域问题
var app = express(); //app包含了express所有的api
var {
  checkToken
} = require("./utils");
// view engine setup
app.set('views', path.join(__dirname, 'views')); // views 文件路径设置为绝对的 __dirname 根路径  views === / 
app.set('view engine', 'ejs');  // ejs 设置模板引擎 

app.use(cors());  // 解决跨越问题   重置协议  服务器没有任何安全协议 
app.use(logger('dev'));  //日志打印
app.use(express.json()); //获取表单post 提交 或者 ajax post 传递的 参数 (fromData)
app.use(express.urlencoded({ extended: false }));   // req.body 获取post 请求参数 
app.use(cookieParser());  // 设置服务器的 cookies 

// 设置加载 静态文件  express.static  服务器的静态资源
// public = / 
app.use(express.static(path.join(__dirname, 'public')));

//app.use(function(req,res,next){
//   console.log("一直触发");
//   next(); 进入下一步中间件
// })

//session 中间件 必须写在路由在中间件前面
app.use(session({
  name:"AppTest",
  cookie:{maxAge:1000*60*60},  //session存储一小时，之后登录或失效，需要重新登录
  secret:"test",
  resave:false,
  saveUninitialized:true
}))

//设置路由中间件 app.use("路由别名",路由模块)
app.use('/', indexRouter);  // 路由正确 执行成功  不会进入下一步中间件
app.use('/users', usersRouter);  // 区别各个模块之前的名字冲突 
app.use("/comment",commentRouter); // 新增的评论路由模块 
app.use("/react",reactRouter);
// app.use(checkToken);
app.use("/vue",vueRouter);//vue路由别名

// 正确路由地址 == 路由别名 + 路由路径

// catch 404 and forward to error handler
// req 表示请求
// res 响应
// next 表示进入下一个中间件 
// 自定义中间件 
app.use(function(req,res,next){
  console.log("NZ1903-learn express - 404")
  next();
})

app.use(function(req, res, next) {
  console.log(404);
  next(createError(404));  //http状态码
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');   // res.render 渲染页面
});
// ejs 文件本身就是 js  相当于在 js 里面渲染 html 页面 (模板引擎)
  // next()


module.exports = app;


//  启动express 核心配置文件 