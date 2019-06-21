import Vue from 'vue'  //引入Vue
import App from './App.vue'  //引入App.vue
import router from './router'  //引入路由
import './assets/css/reset.css' //引入重置样式
import './assets/css/common.css'  //引入公用样式

import ElementUI from 'element-ui'; //引入ElementUI 的js组件 
import 'element-ui/lib/theme-chalk/index.css';  //引入ElementUI 的css样式

import Echarts from 'echarts';  //引入echarts

Vue.prototype.$echarts = Echarts;  //把echarts挂载到原型上

//引入对本地存储的操作函数
import local from '@/utils/local';

//路由守卫拦截所有路由
router.beforeEach((to,from,next) =>{
    //获取token
    const token = local.get('account_token');
    //判断
    if(token){  
      next();  //有token就放行
    }else{
      //去登陆就直接放行
      if(to.path === '/login'){
        next();
      }else{
        next({path:'/login'});  //去的是其他页面，直接跳转到登录页面。
      }
    }
})

Vue.use(ElementUI); //注册ElementUI

Vue.config.productionTip = false  //阻止生产提示

new Vue({ // 创建Vue实例对象
  router,   //传入路由
  render: h => h(App)  //传入顶级组件App.vue 渲染
}).$mount('#app')  //挂载DOM
