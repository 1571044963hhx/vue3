import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from "../store/modules/user";


let request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
    timeout: 50000,
})
const cancelSource = axios.CancelToken.source()
//请求拦截器
request.interceptors.request.use((config: any) => {
    console.log(request)
    const usestore =useUserStore();
    if(usestore.token){
        config.headers.token =usestore.token
    }
    config.cancelToken = cancelSource.token
    return config;

});//一定要有return返回

//响应拦截器
request.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    console.log(error)
    let msg = '';
    let status = error.response.status;
    switch (status) {
        case 401:
            msg = "token过期";
            break;
        case 403:
            msg = '无权访问';
            break;
        case 404:
            msg = "请求地址错误";
            break;
        case 500:
            msg = "服务器出现问题";
            break;
        default:
            msg = "无网络";
    }
    ElMessage({
        type: 'error',
        message: msg
    })
    return Promise.reject(error);//移除拦截器，出现错误的时候使用
})
export {cancelSource}
export default request;
