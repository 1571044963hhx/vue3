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

// 用户登录：用户提交登录凭据(账号，密码)，前端将凭据发送到服务器。
// 服务器验证：服务器验证凭据并生成 token。
// 前端存储：前端接收到 token 后，将其存储在浏览器中。
// 使用 token：在后续请求中，前端将 token 添加到请求头，服务器验证 token 并返回相应的数据。