<script setup lang="ts">
// import Svgicon from "../src/components/SvgIcon/index.vue"
// import { onMounted } from "vue";
// import request from "./utils/request";
// import { reqLogin } from "./Api/user";
// onMounted(() => {
//     request({
//         url: '/user/login',
//         data: {
//             username: 'admin',
//             password: '111111'
//         }//请求体
//     })
// })
// onMounted(() => {
//     reqLogin({
//         username: 'admin',
//         password: 111111
//     })
// })
</script>

<template>
    <!-- <h1>我是APP组件</h1>
    <h1>我是APP组件</h1>
    <div class="gg">
        <svg>
            <use xlink:href="#icon-home1" fill="red">
            </use>
        </svg>
    </div>
    <Svgicon name="phone" color="red" width="200px" height="200px"></Svgicon> -->
    <RouterView></RouterView>


</template>

<style scoped lang="scss"></style>
