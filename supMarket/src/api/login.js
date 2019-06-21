/* 
*登录相关的请求
*
*/

//引入封装好的request.js
import axios from '@/utils/request';

/* 账号添加 */
export function checkLogin(params) {
    return  axios.post('/login/checklogin',params)
}



