<template>
    <div class="tabbar_left">
        <el-icon style="margin-right:10px" @click="changeIcon">
            <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
        </el-icon>
        <el-breadcrumb separator-icon="ArrowRight">
            <!-- 面包动态展示路由名字与标题 -->
            <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title"
                :to="item.path">
                <!-- 图标 -->
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <!-- 面包屑展示匹配路由的标题 -->
                <span>{{ item.meta.title }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>

</template>

<script lang="ts" setup name="breadcrumb">
import { useRoute } from 'vue-router';
import useLayOutSettingStore from '../../../store/modules/setting';
let LayOutSettingStore = useLayOutSettingStore();

let $route = useRoute();
// function changeIcon (){
//     LayOutSettingStore.fold=!LayOutSettingStore.fold
// }
const changeIcon = () => {
    LayOutSettingStore.fold = !LayOutSettingStore.fold
}



</script>

<style scoped lang="scss">

</style>