/* 
*账号管理模块相关的请求
*
*/

//引入封装好的request.js
import axios from '@/utils/request';

/* 账号添加 */
export function accountAdd(params) {
    return  axios.post('/account/accountadd',params);
}

/* 批量删除 */
export function batchDelete(params) {
    return  axios.get('/account/batchdelete',params);
}

/* 编辑 */
export function accountEdit(params) {
    return  axios.get('/account/accountedit',params);
}

/* 保存修改 */
export function accountSaveEdit(params) {
    return  axios.post('/account/accountsaveedit',params)
}

/* 删除 */
export function accountDel(params) {
    return  axios.get('/account/accountdel',params)
}

/* 获取分页数据 */
export function accountListBypage(params) {
    return  axios.get('/account/accountlistbypage', params )
}

/* 把旧密码发给后端 */
export function oldPassword(params) {
    return  axios.post('/account/checkoldpwd',params)
}

/* 把新密码发给后端 */
export function newPassword(params) {
    return  axios.post('/account/checknewpwd',params)
}

/* 获取用户信息 */
export function getAccountInfo() {
    return  axios.get('/account/getaccountinfo')
}
/* 菜单权限 */
export function getRole() {
    return  axios.get('/account/role')
}


