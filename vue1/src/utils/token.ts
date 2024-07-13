//封装本地存储存储数据与读取数据的方法
// 存储数据
export const SET_TOKEN =(token:string)=>{
    localStorage.setItem("TOKEN",token)
}
// 读取数据
export const GET_TOKEN=()=>{
    return localStorage.getItem('TOKEN')
}

export const REMOVE_TOKEN =()=>{
    localStorage.removeItem('TOKEN')
}


