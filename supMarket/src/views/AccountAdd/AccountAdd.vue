<template>
    <div class="account-add">
       <!-- 面板 -->
        <el-card class="box-card">
            <!-- 头部 -->
            <div slot="header" class="clearfix">
                <h2>添加管理员账号</h2>            
            </div>
            <!-- 身体 -->
            <div class="item">
                <!-- 添加账号表格 -->
                <el-form 
                 :model="addAccountForm"
                 status-icon 
                 :rules="rules" 
                 ref="addAccountForm" 
                 label-width="100px" 
                 class="demo-ruleForm"
                 >

                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="addAccountForm.account" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addAccountForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="chackPass">
                    <el-input type="password" v-model="addAccountForm.chackPass" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="用户组" prop="userGroup">
                    <el-select v-model="addAccountForm.userGroup" placeholder="请选择用户组">
                    <el-option label="超级管理员" value="超级管理员"></el-option>
                    <el-option label="普通管理员" value="普通管理员"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">添加</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    //引入工具函数
    import { pwdReg } from '@/utils/reg';
    //引入账号管理模块的函数
    import { accountAdd } from '@/api/account';
    
    
 
    
    export default {
        data() {
            //自定义验证
            //密码验证
            const chackPwd = (rule,value,callback) => {
                //获取value长度
                let len = value.length;
                if(value === ''){
                    callback(new Error('请输入密码')) //非空验证
                } else if(len < 3 || len > 8) {
                    callback(new Error('长度为3 ~ 8 位')) //非空验证
                }else if( !pwdReg(value) ) {
                    callback(new Error('只能输入字母和数字')); //正则验证
                }else{
                    if(this.addAccountForm.chackPass !== ''){
                        this.$refs.addAccountForm.validateField('chackPass') ////触发确认密码一致性验证
                    }
                    callback();
                }
            }
            //确认密码验证
            const comfirmPwd = (rule,value,callback) => {
                if(value === ''){
                    callback(new Error('请再次输入密码')) //非空验证
                }else if(value !== this.addAccountForm.password) {
                    callback(new Error('两次密码输入不一致')) //一致性验证
                }else{
                    callback();
                }
            }
            return {
                //添加账号的表单
                addAccountForm:{
                    account:'',    //账号
                    password:'',    //密码
                    chackPass:'',   //确认密码
                    userGroup:'',   //用户组
                },
                //验证规则
                rules:{
                    //账号验证
                    account:[
                        { required: true, message: "请输入用户名", trigger: "blur" }, //非空验证
                        { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" } //长度验证
                    ],
                    //密码验证
                    password:[  
                        { required: true, validator:chackPwd, trigger: "blur" }, //自定义验证
                    ],
                    //确认密码验证
                    chackPass:[
                        { required: true, validator:comfirmPwd, trigger: "blur" }, //自定义验证
                    ],
                    //用户组验证
                    userGroup:[
                        { required: true, message: "请选择用户组", trigger: "change" }, //非空验证
                    ],

                }

            }
        },
        methods:{
            //添加
            submitForm() {
                this.$refs.addAccountForm.validate(valid => {
                    if(valid){
                        // 收集参数
                        let params = {
                            account: this.addAccountForm.account,
                            password: this.addAccountForm.password,
                            userGroup: this.addAccountForm.userGroup
                        }
                        // 发送给后端
                        accountAdd(params)
                        .then(res => {
                           //接收参数
                           let { code, msg } = res; 
                            //判断
                            if(code === 0){
                                this.$message({
                                    type:'success',
                                    message:msg
                                })
                                //跳转页面
                                this.$router.push('/home/accountmanage');
                            } else if(code === 1){
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
            //重置
            resetForm() {
                 this.$refs.addAccountForm.resetFields();
            }

        }
    }
</script>

<style lang="less">
    .account-add{
        .el-card{
            .el-card__header{
                background: #f2f2f2;  
                padding: 10px;         
                h2{
                    font-size: 16px;
                }
            }
            .el-card__body{
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