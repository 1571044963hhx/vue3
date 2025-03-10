import { createApp } from 'vue'
import App from './App.vue'
//@ts-ignore
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import '../src/styles/index.scss'
import router from './router';
import pinia from './store';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入路由鉴权文件
import "./permission"


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn
})
app.use(pinia)
// //注册全局组件
// import Pagination from '../src/components/Pagination/index.vue'
// app.component('Pagination',Pagination)
import Category from './components/Category/index.vue'
import ChatContent from './views/404/ChatContent.vue'
app.component('Category', Category)
app.component('ChatContent', ChatContent)

app.use(router)

//引入自定义指令文件
import { isHasButton } from './directive/has';
isHasButton(app)

app.config.errorHandler = function (err, vm, info) {
  console.log('项目出问题了')
  console.error('Error: ', err);
  console.error('Component: ', vm);
  console.error('Info: ', info);
};

app.mount("#app")







