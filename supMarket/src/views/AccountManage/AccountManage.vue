<template>
    <div class="account-manage">
        <!-- 面板 -->
       <el-card class="box-card">
           <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>账号管理</h2>           
            </div>
            <!-- 身体 -->
            <div class="item">
                <!-- 表格 -->
                <el-table
                    ref="accountManageForm"
                    :data="accountManageForm"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectChange"
                    >
                    
                    <!-- 选择框 -->
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <!-- 用户名称 -->
                    <el-table-column
                    prop="account"
                    label="用户名称"
                    >
                    </el-table-column>
                    <!-- 用户组 -->
                    <el-table-column
                    prop="userGroup"
                    label="用户组"
                    >
                    </el-table-column>
                    <!-- 日期 -->
                    <el-table-column
                        label="日期">
                        <template slot-scope="scope">{{ scope.row.ctime | filtersCtime }}</template>
                    </el-table-column>
                    <!-- 管理 -->
                    <el-table-column
                    prop="address"
                    label="管理"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleEdit(scope.row.id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row.id)">删除</el-button>
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
                    title="修改账号" 
                    width='400px'
                    :visible.sync="visible">
                    <el-form 
                    :model="editForm" 
                    status-icon
                    :rules='rules'
                    ref='editForm'
                    >
                        <el-form-item label="用户名" label-width="120px" prop='account'>
                        <el-input v-model="editForm.account" autocomplete="off" ></el-input>
                        </el-form-item>

                        <el-form-item label="活动区域" label-width="120px" prop='userGroup'>
                        <el-select v-model="editForm.userGroup" placeholder="请选择用户组">
                            <el-option label="超级管理员" value="超级管理员"></el-option>
                            <el-option label="普通管理员" value="普通管理员"></el-option>
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
    //引入账号管理模块的函数
    import { batchDelete,accountEdit,accountDel,accountSaveEdit,accountListBypage } from '@/api/account';

    export default {
        data() {
            return{
                //表格数据
                accountManageForm:[],
                currentPage:1, //当前页
                total:20,      //总条数
                pageSize:3,    //每页条数
                editId:'',    //
                visible:false, //模态框默认隐藏
                //修改的表单
                editForm:{
                    account:'',
                    userGroup:'',
                },
                delIdArr:[],  //删除id们的数组
                //验证规则
                rules:{
                    account:[
                        {required:true, message:'请输入用户名', trigger: 'change'},
                        {min:3,max:8, message:'长度为3 ~ 8位', trigger: 'change'},
                    ],
                    userGroup:[
                          {required:true, message:'请选择用户组', trigger: 'change'},
                    ]
                },
            }
        },
        methods:{
            //批量删除
            batchDel(){
                //如果没有选择
                if(!this.delIdArr.length){ //delIdArr没有长度
                    this.$message.error('请选择要删除的数据');
                    return;
                }
                //优化用户体验
                this.$confirm('您确认要删除所有文件吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    .then(() => {
                        //把选中的id们发给后台
                        batchDelete({ idArr:this.delIdArr })
                        .then(res => {
                            //接收参数
                            let {code, msg} = res;
                            if(code ===0){
                                this.$message({
                                    type:'success',
                                    message:msg
                                })
                                //刷新页面
                                this.getAccountListByPage();
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
            //取消选择
            deselect(){
                this.$refs.accountManageForm.clearSelection();//选择每个表格，调用取消选择方法
            },
            //编辑事件
            handleEdit(id){
                //显示模态框
                this.visible=true,
                //保留的id就是要修改数据的id 
                this.editId = id; //保留旧的id 
                //发请求
                accountEdit({ id })
                    .then(res => {
                        //接收后端响应数据
                        let {data} = res;
                        //回填表单
                        this.editForm.account = data[0].account;
                        this.editForm.userGroup = data[0].userGroup;
                    })
                    .catch(err => {
                        console.log(err);                     
                    })

            },
            //表格选中状态改变
            selectChange(selectData){
                this.delIdArr = selectData.map( v => v.id); //循环选中的数据，把每一项的id取出来，放入一个数组
            },
            //删除事件
            handleDelete(id) {
                console.log(id);
                this.$confirm('你确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    })
                    //确定走then
                    .then(() => {
                        accountDel({ id })
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
                                this.getAccountListByPage();
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
                this.pageSize = pageSize; //把用户选择的每页条数赋值给data中的pageSize
                this.getAccountListByPage();  //获取分页数据  
            },
            // currentPage（当前页）改变 
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage; //把用户选择的当前页赋值给data中的currentPage
                this.getAccountListByPage();  //获取分页数据
            },
            //保存修改数据
            seveEdit() {
                this.$refs.editForm.validate(valid => {
                    if(valid){
                        //隐藏模态框
                        this.visible = false;
                        let params = {
                            account: this.editForm.account,
                            userGroup: this.editForm.userGroup,
                            id : this.editId,
                        }
                        accountSaveEdit(params)
                            .then(res => {
                                //接收参数
                                let {code,msg} = res;
                                if(code === 0){
                                    this.$message({
                                        type:'success',
                                        message:msg
                                    })
                                    //重新获取数据
                                    this.getAccountListByPage();
                                }else if(code ===1){
                                    this.$message.error(msg);
                                }
                            })
                            .catch(err => {
                                console.log(err);                    
                            })
                        
                    }else{

                    }
                })
            },
            //获取分页数据
            getAccountListByPage() {
                //收集当前页和每页条数
                let params = {
                   pageSize: this.pageSize,
                   currentPage: this.currentPage
                }
                accountListBypage( params )
                    .then(res => {
                       //接收参数
                       let {total, data} = res;
                        this.total = total;
                        this.accountManageForm = data;

                        //边界判断
                        if(!data.length && this.currentPage !==1){
                            this.currentPage -= 1;  //当前页减1
                            this.getAccountListByPage(); //调用自己
                        }
                    })
                    .catch(err => {
                        console.log(err);                    
                    })
                
            },
           
        },
        created() { 
           //this.getAccountList(); //调用获取数据函数
           this.getAccountListByPage();
        },
        filters:{//过滤器
            //格式时间
            filtersCtime(ctime){
                return moment(ctime).format('YYYY-MM-DD hh:mm:ss');
            }
        }
    }
</script>

<style lang="less">
    .account-manage{
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
                .el-alert{
                    margin-bottom: 20px;
                }
                .el-form{
                    width: 300px;
                }
            }
        }
    }
</style>