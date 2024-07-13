import request from "../../../utils/request";
import { UserResponseData } from "./type";

enum API {
    USERINFO_URL = '/admin/acl/user/',
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    SETROLE_URL = '/admin/acl/user/toAssign/',
    SETROLES_URL = '/admin/acl/user/doAssignRole',
    // 删除以及批量删除
    DELETEUSER_URL = '/admin/acl/user/remove/',
    BATCHREMOVE_URL = '/admin/acl/user/batchRemove'
}

//获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number, username:any) =>
    request.get<any, UserResponseData>(
        API.USERINFO_URL + `${page}/${limit}/?username=${username}`)

//新增或者修改用户信息，post或者put请求，需要携带请求数据，记住并不是加号，以逗号和API接口分开，且API接口末尾没有斜杠/
export const reqAddOrUpdateUser = (data: any) => {
    if (data.id) {
        return request.put(API.UPDATEUSER_URL, data)
    } else {
        return request.post(API.ADDUSER_URL, data)
    }
}
export const reqSetRole = (adminId: any) => request.get(API.SETROLE_URL + adminId)
export const reqSetRoles = (data:any)=>request.post(API.SETROLES_URL,data)
export const reqDeleteUser = (id:any)=>request.delete(API.DELETEUSER_URL+id)
export const reqBatchRemove = (idList:any)=>request.delete(API.BATCHREMOVE_URL,{data:idList})

