<template>
    <div class="goods-manage">
        <!-- 面板 -->
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>商品管理</h2>            
            </div>
            <!-- 身体 -->
            <div class="item">
                <!-- 表单 -->
                <el-form 
                    :inline="true" 
                    :model="searchForm" 
                    class="demo-form-inline"
                    size='small'>
                    <!-- 选择框 -->

                    

                    <el-form-item >
                        <el-select v-model="searchForm.classifyName" placeholder="--选择分类--">
                        <el-option label="全部商品" value="全部商品"></el-option>
                        <el-option label="烟酒类" value="烟酒类"></el-option>
                        <el-option label="蔬菜类" value="蔬菜类"></el-option>
                        <el-option label="水果类" value="水果类"></el-option>
                        <el-option label="乳类" value="乳类"></el-option>                     
                        </el-select>
                    </el-form-item>

                     <el-form-item label="关键字:">
                        <el-input v-model="searchForm.keyWord"></el-input>
                    </el-form-item>

                    <el-form-item label="(商品名称，条形码)">
                        <el-button type="primary"  @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格数据 -->
                <el-table
                    :data="goodsTableForm"
                    style="width: 100%"
                    ref="goodsTableForm"
                    @selection-change="selectChange"
                    >
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>

                    <el-table-column
                    prop="goodsBarCode"
                    label="商品条形码"
                    
                    >
                    </el-table-column>

                    <el-table-column
                    prop="goodsName"
                    label="商品名称"
                    
                    >
                    </el-table-column>

                    <el-table-column
                    prop="classifyName"
                    label="所属分类"
                    >
                    </el-table-column>
                    
                     <el-table-column
                    prop="salePrice"
                    label="售价(元)"
                    
                    >
                    </el-table-column>
                    
                    <el-table-column
                    prop="promotion"
                    label="是否促销"
                    >
                    </el-table-column>

                    <el-table-column
                    prop="marketPrice"
                    label="市场价(元)"
                    >
                    </el-table-column>      
                    
                    <!-- 日期 -->
                    <el-table-column
                        label="日期">
                        <template slot-scope="scope">{{ scope.row.ctime | filtersCtime }}</template>
                    </el-table-column>
                
                    <el-table-column 
                    label="操作"
                    width='145%'
                    >
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary" 
                            @click="handleEdit(scope.row.id)">
                            <i class="el-icon-edit"></i>
                            </el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">
                            <i class="el-icon-delete"></i>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <!-- 分页 -->
                <div class="block">
                    
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 3, 5, 10]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
                <!-- 模态框 -->
                <el-dialog 
                    title="修改商品" 
                    width='400px'
                    :visible.sync="visible">
                    <el-form 
                    :model="editForm" 
                    status-icon
                    :rules='rules'
                    ref='editForm'
                    >   
                        <el-form-item label="商品条形码" label-width="120px" prop='goodsBarCode'>
                        <el-input v-model="editForm.goodsBarCode" autocomplete="off" ></el-input>
                        </el-form-item>

                        <el-form-item label="商品名称" label-width="120px" prop='goodsName'>
                        <el-input v-model="editForm.goodsName" autocomplete="off" width='100%'></el-input>
                        </el-form-item>

                        <el-form-item label="商品售价" label-width="120px" prop='salePrice'>
                        <el-input v-model="editForm.salePrice" autocomplete="off" ></el-input>
                        </el-form-item>


                        <el-form-item label="所属分类" label-width="120px" prop='classifyName'>
                        <el-select v-model="editForm.classifyName" placeholder="请选择商品分类">
                            <el-option label="烟酒类" value="烟酒类"></el-option>
                            <el-option label="蔬菜类" value="蔬菜类"></el-option>
                            <el-option label="水果类" value="水果类"></el-option>
                            <el-option label="乳类" value="乳类"></el-option>
                        </el-select>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="seveEdit">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 批量删除按钮 -->
                <div style='margin-top:20px'>
                    <el-button @click='batchDel' type='danger' size='small' >批量删除</el-button>
                    <el-button @click='deselect' type='primary' size='small'>取消选择</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入处理时间格式模块
    import moment from 'moment';
    //引入封装的请求模块
    import { goodsSaveEdit,goodsEdit,goodsDel,goodsListByPage,goodsBatchDel } from '@/api/goods';
    export default {
        data() {
            return {
                currentPage:1, //当前页
                total:0,      //总条数
                pageSize:3,    //每页条数
                editId:'',    //
                visible:false, //模态框默认隐藏
                //查询表单
                searchForm: {
                    classifyName:'', //分类名
                    keyWord:'',    //关键字 
                },
                //商品表格数据
                goodsTableForm: [],
                //修改的数据表单
                editForm:{
                    goodsBarCode:'',
                    goodsName:'', 
                    classifyName: '', //分类
                    salePrice:'',  //售价
                    
                },
                delIdArr:[],  //删除id们的数组
                //验证规则
                rules:{
                    //商品分类
                    classifyName:[
                         { required: true, message: "请选择商品分类", trigger: "change" }, //非空
                    ],
                    //是否促销
                    promotion:[
                         { required: true, message: "请选择是否促销", trigger: "change" }, //非空
                    ],
                    //商品条形码：
                    goodsBarCode:[
                         { required: true, message: "请输入条形码", trigger: "change" },  //非空      
                    ],
                    //商品名称
                    goodsName:[
                         { required: true, message: "请输入商品名称", trigger: "change" },  //非空                      
                    ],
                    //商品价格
                    salePrice:[
                         { required: true,  message: "请输入商品价格，类型为数字", trigger: "change" },  //非空       
                    ],
                  
                },

            }
        },
        methods:{
            //查询
            onSubmit() {
                this.getGoodsListByPage();
            },
            //批量删除
            batchDel(){
                //如果没有选择
                if(!this.delIdArr.length){ //delIdArr没有长度
                    this.$message.error('请选择要删除的数据');
                    return;
                }
                //优化用户体验
                this.$confirm('您确认要删除所有商品吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                        //把选中的id们发给后台                      
                        goodsBatchDel({ idArr:this.delIdArr })
                        .then(res => {
                            //接收参数
                            let {code, msg} = res;
                            if(code ===0){
                                this.$message({
                                    type:'success',
                                    message:msg
                                })
                                //刷新页面
                                this.getGoodsListByPage();
                            }else if(code === 1){
                                this.$message.error(msg);                            
                            }
                            
                        })
                        .catch(err => {
                            console.log(err);
                            
                        })

                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                    });          
                });

            },
            //表格选中状态改变
            selectChange(selectData){
                this.delIdArr = selectData.map( v => v.id); //循环选中的数据，把每一项的id取出来，放入一个数组
            },
            //取消选择
            deselect(){
                this.$refs.goodsTableForm.clearSelection();//选择每个表格，调用取消选择方法
            },
            //保存修改数据
            seveEdit() {
                this.$refs.editForm.validate(valid => {
                    if(valid){
                        //隐藏模态框
                        this.visible = false;
                        let params = {
                            id : this.editId,
                            goodsBarCode: this.editForm.goodsBarCode,
                            goodsName: this.editForm.goodsName,
                            classifyName: this.editForm.classifyName,
                            salePrice: this.editForm.salePrice,
                        }
                        goodsSaveEdit(params)
                            .then(res => {
                                //接收参数
                                let {code,msg} = res;
                                if(code === 0){
                                    this.$message({
                                        type:'success',
                                        message:msg
                                    })
                                    //重新获取数据
                                    this.getGoodsListByPage();
                                }else if(code ===1){
                                    this.$message.error(msg);
                                }
                            })
                            .catch(err => {
                                console.log(err);                    
                            })
                        
                    }else{
                        return false;
                    }
                })
            },
            //编辑
            handleEdit(id) {
                //显示模态框
                this.visible=true,
                //保留的id就是要修改数据的id 
                this.editId = id; //保留旧的id 
                //发请求
                goodsEdit({ id })
                    .then(res => {
                        //接收后端响应数据
                        let {data} = res;
                        //回填表单
                        this.editForm = data[0]
                        
                    })
                    .catch(err => {
                        console.log(err);                     
                    })
            },
            //删除
            handleDelete(id) {
                  this.$confirm('您确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    //确定走then
                    .then(() => {
                        goodsDel({ id })
                        .then(res => {
                            //接收数据
                            let { code, msg } = res;
                            //判断
                            if( code === 0 ){
                                this.$message({
                                    type:'success',
                                    message: msg,
                                })
                                //重新获取数据
                                this.getGoodsListByPage();
                            }else if( code === 1 ){
                                this.$message.error(msg);                   
                            }
                        })
                        .catch(err => {
                            console.log(err);                          
                        })
                    })
                    //取消走catch
                    .catch(() => {   
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                
            },
             // pageSize（每页条数）改变
            handleSizeChange(pageSize) {
                this.pageSize = pageSize; //把用户选择的每页条数赋值给data中的pageSize\
                this.getGoodsListByPage();
            },
            // currentPage（当前页）改变 
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage; //把用户选择的当前页赋值给data中的currentPage
                this.getGoodsListByPage();
            },
            //获取分页数据
            getGoodsListByPage() {
                //收集当前页和每页条数
                let params = {
                   pageSize: this.pageSize,
                   currentPage: this.currentPage,
                   classifyName: this.searchForm.classifyName,
                   keyWord: this.searchForm.keyWord,
                }
                goodsListByPage(params)
                    .then(res => {
                        //接收参数
                        let {total, data} = res;
                        this.total = total;
                        this.goodsTableForm = data;

                        //边界判断
                        if(!data.length && this.currentPage !==1){
                            this.currentPage -= 1;  //当前页减1
                            this.getAccountListByPage(); //调用自己
                        }
                    })
                    .catch(err => {
                        console.log(err);  
                    })
            }
        },
        created() {
            this.getGoodsListByPage();
        },
        filters:{//过滤器
            //格式时间
            filtersCtime(ctime){
                return moment(ctime).format('YYYY-MM-DD');
            }
        }
    }
</script>

<style lang="less">
    .goods-manage{
         .el-card{
            .el-card__header{
                background: #f2f2f2;  
                padding: 10px;         
                h2{
                    font-size: 16px;
                }
            }
            .el-card__body{
                .block{
                    margin-top: 20px;
                }
            }
        }
    }
</style>