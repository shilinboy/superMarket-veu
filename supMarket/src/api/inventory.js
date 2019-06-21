/* 
*库存相关的请求
*
*/

//引入封装好的request.js
import axios from '@/utils/request';

/* 添加库存 */
export function addInventory(params) {
    return  axios.post('/inventory/addinventory',params)
}

/* 分页获取数据 */
export function inventoryByPage(params) {
    return  axios.get('/inventory/inventorylistbypage',params)
}

/* 删除数据 */
export function inventoryDel(params) {
    return  axios.get('/inventory/inventorydelete',params)
}

/* 编辑 */
export function inventoryEdit(params) {
    return  axios.get('/inventory/inventoryedit',params)
}

/* 保存编辑 */
export function inventorySaveEdit(params) {
    return  axios.post('/inventory/inventorysaveedit',params)
}

/* 批量删除 */
export function inventoryBatchDel(params) {
    return  axios.get('/inventory/inventorybatchdelete',params)
}

