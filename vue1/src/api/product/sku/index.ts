import request from "../../../utils/request";

enum API {
    GETSKU_URL = '/admin/product/list/',
    CANCELSALE_URL = '/admin/product/cancelSale/',
    ONSALE_URL = '/admin/product/onSale/',
    //获取sku的详细信息
    GETSKUINFO_URL = '/admin/product/getSkuInfo/',
    DELETE_URL = '/admin/product/deleteSku/'

}

export const reqGetSku = (page: any, limit: any) => request.get<any, any>(API.GETSKU_URL + `${page}/${limit}`)
export const reqOnSale = (skuid: any) => request.get<any, any>(API.ONSALE_URL + skuid)
export const reqCancelSale = (skuid: any) => request.get<any, any>(API.CANCELSALE_URL + skuid)
//获取sku的详细信息
export const reqGetSkuInfo = (skuid: any) => request.get<any, any>(API.GETSKUINFO_URL + skuid)
export const reqDelete = (skuid: any) => request.delete<any, any>(API.DELETE_URL + skuid)