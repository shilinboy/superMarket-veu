var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



//引入子路由
// var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');  //账号
var goodsRouter = require('./routes/goods');      //商品
var loginRouter = require('./routes/login');      //登录
var inventoryRouter = require('./routes/inventory');  //库存

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//注册子路由
// app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/goods', goodsRouter);
app.use('/login', loginRouter);
app.use('/inventory', inventoryRouter);


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
//监听
app.listen(3000, ()=> {
  console.log('服务器启动成功:http://127.0.0.1:3000');
  
})
module.exports = app;
