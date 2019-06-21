/* 
*   axios发送请求封装
*
*/

//引入axios
import axios from 'axios';
//引入qs
import qs from 'qs';

//引入封装的本地存储
import local from '@/utils/local';

//设置默认请求服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:3000';

/* 
    axios请求拦截器： 
        在axios发送请求之前，把它拦截，让他先携带一点东西
        再发出请求。
*/ 
//设置请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    let token = local.get('account_token');
    // 请求头携带token
    config.headers.authorization = `Bearer ${token}` 
    return config;
})


export default {
    get(url, params={}) {
        return new Promise((resolve,reject) => {
            axios.get(url,{ params })
                .then(response => {
                    resolve(response.data); //成功
                })
                .catch(err => {
                    reject(err);  //失败
                })
        })
    },
    post(url, params={}) {
        return new Promise((resolve,reject) => {
            axios.post(url, qs.stringify( params ))
                .then(response => {
                    resolve(response.data); //成功
                })
                .catch(err => {
                    reject(err);  //失败
                })
        })
    }
}
