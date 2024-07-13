//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '../src/router/index'
import setting from "./setting"

//@ts-ignore
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
import pinia from './store/index'
import useUserStore from './store/modules/user'
const usestore = useUserStore(pinia);



//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start();
  if (usestore.token) {
    if (to.path == '/logins') {
      usestore.userLogout();
    } else {
      if (usestore.username) {
        next()
      } else {
        try {
          await usestore.userInfo();
          next({...to})
        }
        catch (error) {
          await usestore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next();
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

//第一个问题:任意路由切换实现进度条业务 ---nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[指向首页],其余的路由可以访问