import request from "../../utils/request";
import type {   loginFormData,loginResponseData, userInfoReponseData, } from './type'

//http://139.198.104.211:8510/swagger-ui.html#/  swagger文档
//http://sph-api.atguigu.cn   服务器域名
//http://39.98.123.211:8510/swagger-ui.html
//项目用户相关的请求地址

//项目用户相关的请求地址
enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout',
  }
//登录接口

export const reqLogin = (data: loginFormData) =>
    request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息
export const reqUserInfo = ()=>request.get<any,userInfoReponseData>(API.USERINFO_URL)
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)