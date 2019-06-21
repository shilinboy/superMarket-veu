/* 
*商品管理模块相关的请求
*
*/

//引入封装好的request.js
import axios from '@/utils/request';

/* 账号添加 */
export function goodsAdd(params) {
    return axios.post('/goods/goodsadd',params)
}

/* 保存修改数据 */
export function goodsSaveEdit(params) {
    return axios.post('/goods/goodssaveedit',params)
}

/* 编辑 */
export function goodsEdit(params) {
    return  axios.get('/goods/goodsedit',params)
}

/* 获取分页数据 */
export function goodsListByPage(params) {
    return  axios.get('/goods/goodslistbypage',params)
}

/* 删除 */
export function goodsDel(params) {
    return  axios.get('/goods/goodsdelete',params)
}

/* 批量删除 */
export function goodsBatchDel(params) {
    return  axios.get('/goods/goodsbatchdelete',params)
}

/* 重新获取销售数据 */
export function getSellDate(params) {
    return  axios.get('/goods/getselldata',params)
}