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

//测试连接
/* router.get('/',(req,res) => {
    res.send('测试是否走通');
}) */

/* 添加账号 */
router.post('/accountadd',(req,res) => {
    //接收参数
    let { account, password, userGroup } = req.body;

    //设置默认头像
    let avatarUrl = `/upload/avatar.jpg`;

    //准备sql
    const sqlStr = `insert into accounts(account, password, userGroup,avatarUrl) values('${account}', '${password}', '${userGroup}', '${avatarUrl}')`

    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        console.log(data);
        //判断
        if(data.affectedRows > 0 ){
            res.send({code: 0, msg: '添加账号成功！' }) //响应数据给成功的前端
        }else {
            res.send({code: 1, msg:'添加账号失败！'})  //响应数据给失败的前端
        }
        
    })
})


/* 删除数据 */
router.get('/accountdel',(req,res) => {
    //接收数据
    let { id } = req.query;
    //准备sql
    const sqlStr = `delete  from accounts where id=${id}`;
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        console.log(data);
        //判断
        if(data.affectedRows > 0){
            res.send({code:0, msg:"删除成功！"}) //响应数据给前端
        }else {
            res.send({code:1, msg:"删除失败！"})
        }
        
    })
})

/* 编辑数据回填 */
router.get('/accountedit',(req,res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    const sqlStr = `select * from accounts where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) err;
        console.log(data);
        res.send({ data });      
    })
})

/* 保存编辑 */
router.post('/accountsaveedit',(req,res) => {
    //接收参数
    let { account ,userGroup ,id } = req.body;
    //准备sql
    const sqlStr = `update accounts set account='${account}', userGroup='${userGroup}' where id=${id}`;
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        console.log(data);
        //判断
        if(data.affectedRows > 0){
            res.send({code:0, msg:'修改成功！'});
        }else{
            res.send({code:1, msg:'修改失败！'})
        }  
    })
})

/* 批量删除 */
router.get('/batchdelete',(req,res) => {
    //接收参数
    let { idArr } = req.query;
    //准备sql
    const sqlStr = `delete from accounts where id in (${idArr})`;
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code:0,msg:'批量删除成功！'})
        }else{
            res.send({code:0,msg:'批量删除失败！'})
        }
    })
})

/* 获取分页数据 */
router.get('/accountlistbypage',(req,res) => {
    //接收参数
    let { pageSize,currentPage } = req.query;

    //定义变量保存总条数
    let total;

    //准备sql
    let sqlStr = `select * from accounts order by ctime desc`;

    console.log(sqlStr);
    
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        total = data.length; //获取数据总条数 
    })
    //准备sql，按照分页查询数据
    let n = (currentPage - 1) * pageSize; //跳过多少条数据

    sqlStr +=` limit ${n},${pageSize}`;//分页的sql

    console.log(sqlStr);
    

    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        res.send({total,data});  //把数据和total响应给前端
    })
})

/* 查询旧密码 */
router.post('/checkoldpwd',(req,res) => {
    //接收旧密码
    let { oldPwd } = req.body;
    //验证旧密码是否正确
    if(oldPwd === req.user.password){
        res.send({code:0,msg:'原密码正确！'})
    }else{
        res.send({code:1,msg:'原密码错误！'})
    }
})

/* 修改密码 */
router.post('/checknewpwd',(req,res) => {
    //接收参数
    let { newPassword } = req.body;
    //取到当前用户的id
    let id = req.user.id;
    //准备sql
    const sqlStr = `update accounts set password='${newPassword}' where id=${id}`;
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        if(data.affectedRows > 0) {
            res.send({code:0,msg:'修改密码成功，请重新登录'})
        }else{
            res.send({code:0,msg:'修改密码失败！'})
        }
    })
})

/* 获取用户数据 */
router.get('/getaccountinfo',(req,res) => {
    //获取id
    let id = req.user.id;
    //准备sql
    const sqlStr = `select * from accounts where id=${id}`;
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        res.send({data});
    })
})

/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
	var file = req.file;
	console.log(file)

	// 文件名
	let fileName = file.filename;
	// 拼接文件路径
	let avatarUrl = '/upload/' + fileName

	// 构造sql
	const sqlStr = `update accounts set avatarUrl = '${avatarUrl}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
	})
})

/* ----上传结束----- */ 

/* 获取用户的角色 */
router.get('/role',(req,res) => {
    res.send({ role:req.user.userGroup })
})

module.exports = router;
