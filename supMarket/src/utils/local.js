/* 
* 对本地存储操作的封装
*
*/

export default{
    get(key){
        return window.localStorage.getItem(key);
    },
    set(key,value){
        return window.localStorage.setItem(key,value);
    },
    remove(key){
        return window.localStorage.removeItem(key);
    }
}