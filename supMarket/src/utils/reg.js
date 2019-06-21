/* 
*   工具函数
*/

//验证密码
export let pwdReg = (value) => {
    //正则
    const reg = /^[A-Za-z0-9]+$/;
    return reg.test(value);
}