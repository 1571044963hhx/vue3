<template>
    <el-sub-menu index="1">
        <template #title>
            <el-icon>
                <location />
            </el-icon>
            <span>文件上传</span>
        </template>
        <el-menu-item-group>
            <el-menu-item index="1-1" @click="handler1">图片上传</el-menu-item>
            <el-menu-item index="1-2" @click="handler2">多文件上传</el-menu-item> 
            <el-menu-item index="1-2" @click="handler3">拖拽上传</el-menu-item>    
            <el-menu-item index="1-2" @click="handler4">大文件上传</el-menu-item>
        </el-menu-item-group>
    </el-sub-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter()
const handler1 = ()=>{
    $router.push('/file/image')
}
const handler2 = ()=>{
    $router.push('/file/manyfile')
}
const handler3 = ()=>{
    $router.push('/file/dragup')
}
const handler4 = ()=>{
    $router.push('/file/bigfileup')
}



</script>

<script lang="ts">
export default {
    name: 'Menu'
}
</script>

<style scoped lang="scss"></style>