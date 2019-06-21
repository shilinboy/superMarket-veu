import Vue from 'vue'   //引入Vue
import Router from 'vue-router' //引入路由


Vue.use(Router) //注册路由

export default new Router({  //暴露路由实例对象
  routes: [ //配置路由
    {
      path: '/', redirect: '/login'  //根目录重新定向到/login
    },
    {
      path: '/login', 
      component: () => import('./views/Login/Login.vue')
    },
    {
      path: '/home',     
      component: () => import('./views/Home/Home.vue'), //后端父级组件
      redirect: '/home/systeminfo',  //重定向
      children: [
        {
          path: '/home/systeminfo', 
          component: () => import('./views/SystemInfo/SystemInfo.vue') //系统信息
        },
        {
          path: '/home/accountmanage', 
          component: () => import('./views/AccountManage/AccountManage.vue') //账号管理
        },
        {
          path: '/home/accountadd', 
          component: () => import('./views/AccountAdd/AccountAdd.vue') //添加账号
        },
        {
          path: '/home/passwordmodify', 
          component: () => import('./views/PasswordModify/PasswordModify.vue') //密码修改
        },
        {
          path: '/home/goodsmanage', 
          component: () => import('./views/GoodsManage/GoodsManage.vue') //商品管理
        },
        {
          path: '/home/goodsadd', 
          component: () => import('./views/GoodsAdd/GoodsAdd.vue') //添加商品
        },
        {
          path: '/home/selltotal', 
          component: () => import('./views/SellTotal/SellTotal.vue') //销售统计
        },
        {
          path: '/home/stocktotal', 
          component: () => import('./views/StockTotal/StokTotal.vue') //进货统计
        },
        {
          path: '/home/addinventory', 
          component: () => import('./views/AddInventory/AddInventory.vue') //添加库存
        },
        {
          path: '/home/inventorymanage', 
          component: () => import('./views/InventoryManage/InventoryManage.vue') //库存管理
        },
        {
          path: '/home/personal', 
          component: () => import('./views/Personal/Personal.vue') //个人中心
        },
        
      ]
    },
  ]
})
