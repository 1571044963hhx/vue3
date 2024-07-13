<template>
    <h1>我是index组件</h1>
    <h1>我是index组件</h1>
    <svg :height="height" :width="width">
        <use :xlink:href="prefix+name" :fill="color" >        
        </use>
    </svg>
</template>

<script setup lang="ts" name="index">
defineProps({
    prefix:{
        type:String,
        default:'#icon-' 
    },
    name:{
        type:String
    },
    height:{
        type:String,
        default:'100px'
    },
    width:{
        type:String,
        default:'100px'
    },
    color:{
        type:String,
        default:'green'
    }
})
</script>

<style scoped>

</style>
