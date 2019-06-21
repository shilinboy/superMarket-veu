var express = require('express');
var router = express.Router();

//统一设置请求头解决跨域问题
router.all('*',(req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers", "authorization "); // 允许携带这个头部信息
    next()  //放行
})

/* -----  拦截所有请求 请求中必须携带token（令牌才响应数据 否则响应错误信息）-------- */ 
const expressJwt = require('express-jwt'); // 引入检查token的模块
//秘钥
const secret = 'accounts';

// 检查token合法性 如果不合法 就会抛出错误哦
router.use(expressJwt ({
    secret
}).unless({
    path: ['/login/checklogin']  // 不需要验证的请求url
}))

//拦截器
router.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {   
        // 响应错误状态码 和 错误信息
        res.status(401).send('token无效，你的请求要携带正确的token才能获取到数据哦！');
    }
})
/*------ 拦截请求结束 ------*/ 

//引入连接数据库模块
const connection = require('./js/conn')

//引入jwt
const jwt= require('jsonwebtoken');


/* 检查登录 */
router.post('/checklogin',(req,res) => {
    //接收参数
    let { account, password } = req.body;
    //准备sql
    const sqlStr = `select * from accounts where account='${account}' and password='${password}'`;
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        //判断
        if(data.length){
            //生成token
            const token = jwt.sign(Object.assign({},  data[0]), secret, { 
			    expiresIn:  60 * 60 * 2 // 过期时间
            })
            res.send({code:0,msg:'欢迎您，登录成功！',token})
        }else{
            res.send({code:1,msg:'请检查账号和密码！',})
        }
    })
})



module.exports = router;
