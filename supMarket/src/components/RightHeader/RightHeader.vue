<template>
  <div class="right-header">
    <el-row>
        <!-- 左边 -->
      <el-col :span="12">
        
            <h3 class="title">
                <i class="el-icon-menu"></i>
                永辉超市管理系统
            </h3>
       
      </el-col>
      <!-- 右边 -->
      <el-col :span="12">
        <el-row>
            <el-col :span='17'>
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                    {{ userName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            <el-col :span='7'>
                <div class="avatar">
                    <img :src="avatarUrl" alt="">
                </div>
            </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    //引入对本地存储的操作函数
    import local from '@/utils/local';
    //引入请求
    import { getAccountInfo,} from '@/api/account'
export default {
    data(){
        return {
            userName:'',
            avatarUrl:'',
        }
    },
    methods:{
        handleCommand(command){
            if(command === 'logout'){  //退出登录
                //清除token
                local.remove('account_token');
                //弹提示
                this.$message({
                    type:'success',
                    message:'退出登录成功！ 欢迎下次登录！'
                })
                setTimeout(() => {
                        //  跳转到登录页面
                        this.$router.push('/login')
                    }, 1000)
            }else if(command === 'personal'){ //个人中心
                //跳到个人中心
                this.$router.push('/home/personal');
            }
        },
        //获取用户信息
        getUserInfo () {
            //发请求获取用户数据
            getAccountInfo()
            .then(res => {
                //接收参数
                let {data} = res;
                //获取用户名和头像地址
                let { account,avatarUrl } = data[0];
                this.userName = account;  //账号
                this.avatarUrl = 'http://127.0.0.1:3000' + avatarUrl;  //渲染头像的地址
            })
            .catch(err => {
                console.log(err);
            })
        }
    },
    created() {
        this.getUserInfo();
    }

};
</script>

<style lang="less">
    .right-header{
        
        color:#2d3a4b;
        border-bottom:1px solid #ccc;
        & > .el-row{
          & > .el-col{
                .title{
                    font-size: 20px;
                    
                }
                .el-row{
                    .el-col:first-child{
                        text-align: right;
                    }
                    .el-col:last-child{
                        text-align: center;
                        .avatar{
                            width: 50px;
                            height: 50px;
                            background: #2d3a4b;
                            margin-top: 5px;
                            margin-left: 20px;
                            border-radius: 50%;
                            img{
                               width: 100%;
                               height: 100%;
                               border-radius: 50%;
                            }
                        }
                    }
                }
                
            }
        }
    }
</style>