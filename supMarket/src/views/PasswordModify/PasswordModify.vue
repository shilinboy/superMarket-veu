<template>
    <div class="password-modify">
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
                 :model="modifyPasswordForm"
                 status-icon 
                 :rules="rules" 
                 ref="modifyPasswordForm" 
                 label-width="100px" 
                 class="demo-ruleForm"
                 >

                <el-form-item label="原密码" prop="oldPassword">
                    <el-input type="password" v-model="modifyPasswordForm.oldPassword" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="modifyPasswordForm.newPassword" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认新密码" prop="chackPass">
                    <el-input type="password" v-model="modifyPasswordForm.chackPass" autocomplete="off"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">提交</el-button>
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
    //引入请求模块
    import {oldPassword,newPassword} from '@/api/account';
    //本地存储模块
    import local from '@/utils/local';

    export default {
        data() {
            //自定义验证
            //旧密码验证
            const chackOldPwd = (rule,value,callback) => {
                let len = value.length;
                if(value === ''){
                    callback(new Error('请输入旧密码')); //非空
                }else {
                    oldPassword({oldPwd:value})
                    .then(res => {
                        //接收参数
                        let {code,msg} = res;
                        //判断
                        if(code===1){
                            callback(new Error(msg))
                        }else if(code===0){
                            callback();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        
                    })
                }                                 
            }
            //新密码验证
            const chackNewPwd = (rule,value,callback) => {
                //获取value长度
                let len = value.length;
                if(value === ''){
                    callback(new Error('请输入密码')) //非空验证
                } else if(len < 3 || len > 8) {
                    callback(new Error('长度为3 ~ 8 位')) //长度验证
                }else if( !pwdReg(value) ) {
                    callback(new Error('只能输入字母和数字')); //正则验证
                }else if( value=== this.modifyPasswordForm.oldPassword ) {
                    callback(new Error('新密码不能与旧密码一样'))
                }   
                else{
                    if(this.modifyPasswordForm.chackPass !== ''){
                        this.$refs.modifyPasswordForm.validateField('chackPass') ////触发确认密码一致性验证
                    }
                    callback();
                }
            }
            //确认密码验证
            const comfirmPwd = (rule,value,callback) => {
                if(value === ''){
                    callback(new Error('请再次输入密码')) //非空验证
                }else if(value !== this.modifyPasswordForm.newPassword) {
                    callback(new Error('两次密码输入不一致')) //一致性验证
                }else if( value=== this.modifyPasswordForm.oldPassword ) {
                    callback(new Error('新密码不能与旧密码一样'))
                } else {
                    callback();
                }
            }
            return {
                //修改密码的表单
                modifyPasswordForm:{
                    oldPassword:'',    //旧密码
                    newPassword:'',    //新密码
                    chackPass:'',   //确认密码                  
                },
                //验证规则
                rules:{
                    //账号验证
                    oldPassword:[
                        { required: true, validator:chackOldPwd, trigger: "blur" }, //非空验证
                        
                    ],
                    //密码验证
                    newPassword:[  
                        { required: true, validator:chackNewPwd, trigger: "blur" }, //自定义验证
                    ],
                    //确认密码验证
                    chackPass:[
                        { required: true, validator:comfirmPwd, trigger: "blur" }, //自定义验证
                    ],
                    
                }

            }
        },
        methods:{
            //提交
            submitForm() {
                this.$refs.modifyPasswordForm.validate(valid => {
                    if(valid){
                        // 收集参数
                        let params = {
                            newPassword: this.modifyPasswordForm.newPassword,
                        }
                        // 发送给后端
                        newPassword(params)
                        .then(res => {
                            //接收参数
                            let {code,msg} = res;
                            if(code===0){
                                this.$message({
                                    type:'success',
                                    message: msg
                                })
                                //清除token
                                local.remove('account_token')
                                this.$router.push('/login')
                            }else if(code===1){
                                this,$message.error(msg)
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
                 this.$refs.modifyPasswordForm.resetFields();
            }

        }
    }
</script>

<style lang="less">
    .password-modify{
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