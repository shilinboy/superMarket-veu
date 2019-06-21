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

/* 添加商品 */
router.post('/goodsadd',(req,res) => {
    //接收参数
    let {classifyName, goodsBarCode,  goodsName, salePrice,  marketPrice,   costPrice,  InventoryNum, goodsWeight, goodsUnit,  vipDiscounts,   promotion, goodsDesc } = req.body;
    //准备sql
    const sqlStr = `insert into goods(classifyName, goodsBarCode,  goodsName, salePrice,  marketPrice,   costPrice,  InventoryNum, goodsWeight, goodsUnit,  vipDiscounts,   promotion, goodsDesc) values(?,?,?,?,?,?,?,?,?,?,?,?) `

    //参数
    const sqlParams = [classifyName, goodsBarCode,  goodsName, salePrice,  marketPrice,   costPrice,  InventoryNum, goodsWeight, goodsUnit,  vipDiscounts,   promotion, goodsDesc] 
    //执行sql
    connection.query(sqlStr,sqlParams,(err,data) => {
        if(err) throw err;
        //判断
        if(data.affectedRows > 0){
            res.send({code:0,msg:'添加商品成功！'})
        }else {
            res.send({code:0,msg:'添加商品失败！'})
        }
    })
})

/* 获取分页数据 */
router.get('/goodslistbypage',(req,res) => {
    //接收参数
    let { pageSize,currentPage,classifyName,keyWord } =req.query;
    //定义变量保存总条数
    let total;

    //准备sql
    let sqlStr = `select * from goods where 1=1`;

    // 如果分类不等于空 且 不等于全部
	if (classifyName !== '' && classifyName !== '全部商品') {
		// 拼接第一个查询条件
		sqlStr += ` and classifyName='${classifyName}'`;
	}

	// 如果第二个关键字不为空 那么就拼接sql
	if (keyWord !== '') {
		sqlStr += ` and (goodsName like '%${keyWord}%' or goodsBarCode like '%${keyWord}%')`
	}

	// 拼接排序
	sqlStr += ` order by ctime desc`
    
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        total = data.length; //获取数据总条数 
    })
    //准备sql，按照分页查询数据
    let n = (currentPage - 1) * pageSize; //跳过多少条数据

    sqlStr +=` limit ${n},${pageSize}`;//分页的sql 

    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) throw err;
        res.send({total,data});  //把数据和total响应给前端
    })
 
})

/* 删除数据 */
router.get('/goodsdelete',(req,res) => {
    //接收数据
    let { id } = req.query;
    //准备sql
    const sqlStr = `delete from goods where id=${id}`;
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
router.get('/goodsedit',(req,res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    const sqlStr = `select * from goods where id=${id}`
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if(err) err;
        console.log(data);
        res.send({ data });      
    })
})

/* 保存编辑 */
router.post('/goodssaveedit',(req,res) => {
    //接收参数
    let {  id, goodsBarCode, goodsName, classifyName, salePrice } = req.body;
    //准备sql
    const sqlStr = `update goods set goodsBarCode='${goodsBarCode}', goodsName='${goodsName}',classifyName='${classifyName}',salePrice='${salePrice}' where id=${id}`;

    //console.log(sqlStr);
    
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
    //res.send('666');
})

/* 批量删除 */
router.get('/goodsbatchdelete',(req,res) => {
    //接收参数
    let { idArr } = req.query;
    //准备sql
    const sqlStr = `delete from goods where id in (${idArr})`;
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

/* 获取销售数据 */
router.get('/getselldata',(req,res) => {

    res.send({
        xdata:['2019-06-13', '2019-06-14', '2019-06-15', '2019-06-16', '2019-06-17', '2019-06-18', '2019-06-19'] ,
        seriesData:[1220, 1032, 1501, 2534, 1590, 3130, 2320]
    });
})


module.exports = router;
