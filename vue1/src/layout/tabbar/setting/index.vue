<template>
    <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
    <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
    <el-popover title="设置属性" placement="bottom" :width="400" trigger="focus">
        <el-form>
            <el-form-item label="颜色属性（长按触发）:">
                <el-color-picker v-model="color" show-alpha :predefine="predefineColors" @change="setColor" />               
            </el-form-item>

            <el-form-item label="暗黑模式：">
                <el-switch @change="changeDark" v-model="dark" class="mt-2" style="margin-left: 24px" inline-prompt
                    active-icon="MoonNight" inactive-icon="Sunny" />
            </el-form-item>
        </el-form> 
        <template #reference>
            <el-button size="small" icon="Setting" circle></el-button>
        </template>
    </el-popover>
    <span>
        <img :src="usestore.avatar" style="width: 24px; height: 24px; margin: 15px; border-radius: 50%;">
    </span>
    <el-dropdown>
        <span class="el-dropdown-link">{{ usestore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup name="breadcrumb">
import useLayOutSettingStore from '../../../store/modules/setting';
import useUserStore from '../../../store/modules/user';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue'


let usestore = useUserStore();
let LayOutSettingStore = useLayOutSettingStore();
let $route = useRoute();
let $router = useRouter();
let dark = ref(false);

const updateRefsh = () => {
    LayOutSettingStore.refsh = !LayOutSettingStore.refsh
    console.log(LayOutSettingStore.refsh)
}

const fullScreen = () => {
    let full = document.fullscreenElement;
    if (!full) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
const logout = async () => {
    //第一件事情:需要向服务器发请求[退出登录接口]******
    //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
    //第三件事情:跳转到登录页面
    await usestore.userLogout();
    $router.push({ path: '/login', query: { redirect: $route.path } });
}


const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
    //获取HTML根节点
    let html = document.documentElement;
    //判断HTML标签是否有类名dark
    dark.value ? html.className = 'dark' : html.className = '';
}

//主题颜色的设置
const setColor = ()=>{
   //通知js修改根节点的样式对象的属性与属性值
   console.log('触发了')
   const html = document.documentElement;
   html.style.setProperty('--el-color-primary',color.value);
}

</script>

<style scoped lang="scss"></style>