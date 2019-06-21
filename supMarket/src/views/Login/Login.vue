<template>
  <div class="login">
     
    <!-- 登录表单的容器 -->
    <div class="login-wrap">
      <!-- 标题 -->
      <h3 class="title">
        <i class="el-icon-s-custom"></i>
        超市管理系统-登录
      </h3>

      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="account">
          <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm()">登录</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    //引入工具函数
    import { pwdReg } from '@/utils/reg';
    //引入对本地存储的操作函数
    import local from '@/utils/local';
    //引入封装的login请求模块
    import { checkLogin } from '@/api/login';
export default {
    //数据
  data() {
    //自定义验证
    //密码验证
    let checkPwd = (rule, value, callback) => {
            //获取值的长度
            let len = value.length;
           if(value === ''){
               callback(new Error('请输入密码')); //非空验证
           }else if(len < 3 || len > 8){
               callback(new Error('长度为3~8位之间')); //长度验证
           }else if(!pwdReg(value)){
               callback(new Error('只能输入字母和数字')); //正则验证
           }else {
               //确认密码不为空触发验证
               if(this.loginForm.checkPass !== ''){
                   this.$refs.loginForm.validateField('checkPass'); //触发确认密码一致性验证
               }
               callback(); //成功
           }      
    }
    //确认密码验证
    let confirmPwd = (rule,value,callback) => {
        if(value === '') {
            callback(new Error('请再次输入密码')); //非空验证
        }else if(value !== this.loginForm.password){
            callback(new Error('两次密码输入不一致')); //一致性验证
        }else {
            callback(); //成功
        }
    }
    return {
      //登录表单的数据
      loginForm: {
        account: "",
        password: "",
        checkPass: ""
      },
      //验证规则
      rules: {
          //账户验证
        account: [
          { required: true, message: "请输入用户名", trigger: "blur" }, //非空验证
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" } //长度验证
        ],
        password: [
            { required: true, validator:checkPwd, trigger: "blur" }, //自定义验证
        
        ],
        checkPass: [
            { required: true, validator:confirmPwd, trigger: "blur" },  //自定义验证
        ]
      }
    };
  },
  //方法
  methods: {
    //登录
    submitForm() {
        // 页面中使用ref属性声明的标签dom，可以使用 this.$refs.ref属性的值 获取
        // element内置了验证方法 validate 传入一个函数 函数中的变量如果是true就验证通过 否则验证不通过
      this.$refs.loginForm.validate(valid => {
        if (valid) {
            //收集参数
            let params = {
                  account : this.loginForm.account,
                  password : this.loginForm.password,
            }
            //发请求
            checkLogin(params)
                .then(res => {
                  //接收参数
                  let { code, msg , token } = res;
                  //判断
                  if(code === 0){
                    //将token存入本地存储
                    local.set('account_token',token);
                    //弹提示
                    this.$message({
                      type:'success',
                      message:msg
                    })
                    //跳到首页
                    this.$router.push('/home');
                  }else if(code === 1){
                    this.$message.error(msg);
                  }
                  
                })
                .catch(err => {
                  console.log(err);               
                })

            

        } else {
          
          return false;
        }
      });
    },
    //重置
    resetForm() {
        this.$refs.loginForm.resetFields();
    }
  }
};
</script>

<style lang="less">
@import "./Login.less"; //引入样式
</style>