import pinia from '../store/index.ts'
import useUserStore from '../store/modules/user.ts'
//获取用户管理DOM元素的状态，是配合mounted一起使用的
const userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
  //获取对应的用户仓库
  //全局自定义指令:实现按钮的权限
  app.directive('has', {
    //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    //里面用的是vue2的生命周期  参考链接https://blog.csdn.net/lijiahui_/article/details/122709889
    //el  代表的是所用v-has的dom元素，而option是自定义指令右边的值，v-has=''里面的值  v-has="`btn.Trademark.add`"
    mounted(el: any, options: any) {
        console.log(123)
        console.log(el)
        console.log(options)
      //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
      //从DOM树上干掉
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
