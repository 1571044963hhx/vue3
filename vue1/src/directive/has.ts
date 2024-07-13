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
      //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
      //从DOM树上干掉
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}


//后端返回不同角色对应的不同权限的指令信息，不同节点发送自身的信息，如果该角色存在该按钮权限，则保留，否则删除该节点。
//采用递归展示路由导航组件，根据不同一级路由拥有多少个子路由，当小于且等于一个时，正常展示，当大于一个时，将子路由（二级路由的数据再次传递给组件，组件再次走最开始的步骤，
// 判断子路由是否还有子路由，子路由拥有的子路由的个数，此处需要原始组件的名称，因此需要vue2的写法，再加上一个script标签命名，用该名字进行展示，传递数据，递归）
