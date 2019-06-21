<template>
    <div class='personal'>
        <h2>个人中心</h2>
        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    
                    <p>ID： {{ userInfo.id }}</p>
                    <p>账号： {{ userInfo.account }}</p>
                   
                    <p>用户组： {{ userInfo.userGroup }}</p>
                    <p>创建时间： {{ userInfo.ctime|filterCtiem }}</p>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">
                    <el-upload
                        class="avatar-uploader"
                        action="#"
                        :show-file-list="false"
                        :http-request= 'uploadAvatar'
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <p class="content">上传头像</p>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
   //引入请求模块
   import { getAccountInfo,} from '@/api/account';
   //引入时间处理模块
   import moment from 'moment';
   //引入axios
   import axios from 'axios';
    export default {
        data(){
            return{
               imageUrl:'', 
               userInfo:{},
            }
        },
        methods:{
            //获取用户信息
            getUserInfo(){
                //发请求
                getAccountInfo()
                .then(res => {
                   //接收参数
                   let {data} = res;
                    this.userInfo = data[0]; //渲染页面  
                })
                .catch(err => {
                    console.log(err);
                })
            },
            //头像上传成功
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            //头像上传的限制
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //头像上传函数
            uploadAvatar(file){
                //创建FormData实例
                let formData = new FormData();
                //把文件信息添加进对象
                formData.append('file',file.file);
                //把文件信息发给后端
                axios.post('/account/uploadavatar',formData)
                    .then(response => {
                        //获取头像地址
                        let { avatarUrl } =response.data;
                        //回填
                        this.imageUrl = 'http://127.0.0.1:3000' + avatarUrl;
                        //传递给父组件
                        this.$emit('sonToFather')                    
                    })
                    .catch(err => {
                        console.log(err);
                    })
                
                

            }
        },
        created(){
            this.getUserInfo();// 调用getUserInfo获取用户信息
        },
        filters:{
            filterCtiem(ctime){
                return moment(ctime).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }
</script>

<style lang="less">
    .personal{
        h2{
            font-size: 18px;
        }
        p{
            font-size: 18px;
            margin-top: 30px;
        }
        .el-row{
            .el-col{
                .grid-content{
                    .content{
                        width: 178px;
                        margin: 0;
                        text-align: center;

                    }
                }
                .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    margin-top: 10px;
                }
                .avatar-uploader .el-upload:hover {
                    border-color: #409EFF;
                }
                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 178px;
                    height: 178px;
                    line-height: 178px;
                    text-align: center;
                }
                .avatar {
                    width: 178px;
                    height: 178px;
                    display: block;
                }
            }
        }
    }
</style>