
export interface User{
    "id"?: number,
    "createTime": string,
    "updateTime": string,
    "username"?: string,
    "password"?: string,
    "name"?:string,
    "phone": null,
    "roleName": string
}
export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}

export type Records = User[];
export interface UserResponseData extends ResponseData{
    data:{
        records:Records,        
        total: number,
        size: number,
        current: number,
        pages: number
    }
}
      