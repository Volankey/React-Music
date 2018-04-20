
import Immutable from "seamless-immutable";
/*-----------------
* 步骤 1.提取工具函数
*------------------
*/

/*
*  setValue(o,k,v)
*  用于设置变量的值
*  参数1 元对象 2对象的属性 3 要设置的值
*
* */
export function setValue(o,k,v) {

    return Immutable.set(o,k,v);
}
/*
*  setIn(o,a,v)
*  用于设置变量的值
*  参数1 元对象 2属性层次数组 3 要设置的值
*
* */
export function setIn(o,a,v) {

    return Immutable.setIn(o,a,v);
}

/*
*   replace(o,n,b=true)
*   用于替换
*   参数1 源对象 2 新对象 3 deep？
*
* */
export function replace(o,n,b=true) {
    return Immutable.replace(o,n,{deep:b});
}

/*
* 步骤2
* 提取 case reducer
*
*
* */