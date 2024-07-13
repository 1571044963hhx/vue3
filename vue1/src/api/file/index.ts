//请求接口
import request from '../../utils/request'

enum API {
    //请求上传图片
    uploadImg = '/upload'
}

export const reqUploadImg = (data: any) => request.post(API.uploadImg, data)