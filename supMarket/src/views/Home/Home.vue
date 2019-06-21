<template>
  <div class="home">
    <!-- 布局容器 -->
    <el-container>
        <!-- 左侧栏 -->
      <el-aside width="220px">
        <!-- 3.使用组件 -->
        <LeftNav></LeftNav>
      </el-aside>
      <!-- 右侧 -->
      <el-container>
          <!-- 头部 -->
        <el-header>
            <!-- 头部组件 -->
           <RightHeader ref='rightHeader'></RightHeader>
        </el-header>
        <!-- 内容 -->
        <el-main>
          <!-- 路由出口 -->
          <router-view @sonToFather="fn"></router-view>
        </el-main>
        <!-- 尾部 -->
        <el-footer>
          <!-- 尾部组件 -->
           <RightFooter></RightFooter>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
    //1.引入组件
    import LeftNav from '@/components/LeftNav/LeftNav.vue'; //左侧栏组件
    import RightHeader from '@/components/RightHeader/RightHeader.vue'; //右侧栏头部组件
    import RightFooter from '@/components/RightFooter/RightFooter.vue'; //右侧栏尾部组件

export default {
    
    components: {//2.注册组件
        LeftNav,
        RightHeader,
        RightFooter,
    },
    methods:{
          fn(){
              this.$refs.rightHeader.getUserInfo();    
          }
        }


};
</script>

<style lang="less">
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .el-aside {
      background-color: #2d3a4b;
      color: #333;

      line-height: 200px;
    }
    .el-container {
      
      .el-header {
       line-height: 60px; 
      }
      .el-main {
      }
      .el-footer {
       
       line-height: 60px;
        
        
      }
    }
  }
}

</style>