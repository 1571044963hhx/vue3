import { defineStore } from "pinia";
import { loginFormData, loginResponseData } from "../../api/user/type";
import { reqLogin, reqUserInfo, reqLogout } from "../../api/user";
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from "../../utils/token";
//引入路由(常量路由)
import { constantRoute, asnycRoute, anyRoute } from '../../router/routes';
//引入深拷贝方法
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep';
import router from '../../router';

//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
    return asnycRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                //硅谷333账号:product\trademark\attr\sku
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}


const useUserStore = defineStore('User', {
    state: (): any => {
        return {
            token: GET_TOKEN(),
            menuRoutes: constantRoute,
            // localStorage.getItem('TOKEN')
            username: '',
            avatar: '',
            buttons:[],
        }
    },
    actions: {
        async userLogin(data: loginFormData) {
            //登录请求
            const result: loginResponseData = await reqLogin(data);
            //登录请求：成功200 获取token，失败201 出现登录失败的提示信息
            if (result.code == 200) {
                this.token = (result.data as string)
                SET_TOKEN((result.data as string))
                // localStorage.setItem('TOKEN', result.data.token)
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data))
            }
        },
        async userInfo() {
            const result: any = await reqUserInfo();
            if (result.code == 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                this.buttons = result.data.buttons
                //计算当前用户需要展示的异步路由
                const userAsyncRoute = filterAsyncRoute(
                    cloneDeep(asnycRoute),
                    result.data.routes,
                )
                //菜单需要的数据整理完毕
                this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
                    //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
                    //对于数组，...展开运算符可以将数组中的每个元素分别取出来，形成一个新的数组：
                    ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
                        router.addRoute(route)
                    })
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data.message))
            }
        },
        async userLogout() {
            const result: any = await reqLogout();
            if (result.code == 200) {
                this.username = ''
                this.avatar = ''
                this.token = ''
                REMOVE_TOKEN()
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        }
    },
    getters: {
    }
})
export default useUserStore;


