import request from '../../../utils/request'

enum API {
    GETROLE_URL = '/admin/acl/role/',
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATAROLE_URL = '/admin/acl/role/update',
    SETPERMISSION_URL = '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SETPERMISTION_URL = '/admin/acl/permission/doAssign/?',
    //删除已有的职位
    REMOVEROLE_URL = '/admin/acl/role/remove/',
}
export const reqGetRole = (page: any, limit: any, roleName: any) => request.get(API.GETROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
export const reqAddRole = (data: any) => request.post(API.ADDROLE_URL, data)
export const reqUpdataRole = (data: any) => request.put(API.UPDATAROLE_URL, data)
export const reqSetPermission = (roleId: any) => request.get(API.SETPERMISSION_URL + roleId)

//给相应的职位下发权限
export const reqSetPermisstion = (roleId: number, permissionId: number[]) =>
    request.post(
        API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
    )
//删除已有的职位
export const reqRemoveRole = (roleId: number) =>
    request.delete<any, any>(API.REMOVEROLE_URL + roleId)