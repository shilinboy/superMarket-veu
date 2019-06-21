<template>
  <div class="left-nav">
      <!-- 标题 -->
      <h3 class="title">
          <i class="el-icon-menu"></i>
          永辉超市后台管理系统
      </h3>
    <!-- 导航开始 -->
    <el-menu 
    :default-active="$route.path" 
    background-color="#2d3a4b"
    text-color='#fff'
    active-text-color="rgb(64, 158, 255)"
    unique-opened
    router
    >
      <!-- 导航1 -->
      <el-submenu 
      :index="(i+1) + '' " 
      v-for="(nav, i ) in leftNav"
       :key="i"
       >
        <template slot="title">
          <i :class="nav.iconClass"></i>
          <span>{{ nav.navTitle }}</span>
        </template>
        <el-menu-item 
        :index="subNav.path" 
        v-for="(subNav, i) in nav.children"
         :key="i"
         >{{ subNav.navsubTitle }}
         </el-menu-item>
      </el-submenu>
     
    </el-menu>
  </div>
</template>

<script>
//引入请求
import { getRole } from '@/api/account';
export default {
    data () {
       return {
           //导航栏数据
           leftNav : [],
       }
    },
    created(){
        getRole()
        .then(res => {
            //获取用户的角色
            let { role} = res;
            //定义导航数据
            let nav =   [
                            {    //系统管理
                                    iconClass: 'el-icon-setting',
                                    navTitle: '系统管理',
                                    children: [
                                        { path:'/home/systeminfo', navsubTitle: '系统信息'},
                                    ],
                                    role:["超级管理员","普通管理员"]
                            },
                            {    //账号管理
                                    iconClass: 'el-icon-user',
                                    navTitle: '账号管理',
                                    children: [
                                        { path:'/home/accountmanage', navsubTitle: '账号管理'},
                                        { path:'/home/accountadd', navsubTitle: '添加账号'},
                                        { path:'/home/passwordmodify', navsubTitle: '密码修改'},
                                    ],
                                    role:["超级管理员"]
                            },
                            {    //商品管理
                                    iconClass: 'el-icon-goods',
                                    navTitle: '商品管理',
                                    children: [
                                        { path:'/home/goodsmanage', navsubTitle: '商品管理'},
                                        { path:'/home/goodsadd', navsubTitle: '添加商品'}, 
                                    ],
                                    role:["超级管理员","普通管理员"]
                            },
                            {    //统计管理
                                    iconClass: 'el-icon-notebook-2',
                                    navTitle: '统计管理',
                                    children: [
                                        { path:'/home/selltotal', navsubTitle: '销售统计'},
                                        { path:'/home/stocktotal', navsubTitle: '进货统计'}, 
                                    ],
                                    role:["超级管理员"]
                            },                  
                            {    //添加库存
                                    iconClass: 'el-icon-truck',
                                    navTitle: '进货管理',
                                    children: [
                                        { path:'/home/inventorymanage', navsubTitle: '库存管理'},
                                        { path:'/home/addinventory', navsubTitle: '添加库存'},                      
                                    ],
                                    role:["超级管理员","普通管理员"]
                            },
               
                        ]
                
                //过滤导航
                this.leftNav = nav.filter( v => v.role.includes( role ))
        })
        .catch(err => {
            console.log(err);
            
        })
    }
};
</script>

<style lang="less">
    .left-nav {
        .title{
            color:#fff;
            margin: 20px auto;
            line-height: 0;
            text-align: center;
            font-size: 16px;
        }
        .el-menu {
            border-right: none;
            .el-submenu{
                .el-submenu__title{
                    & > i {
                        color:#fff;
                    }
                }
            }

        }  
    }
</style>