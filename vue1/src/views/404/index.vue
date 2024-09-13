<template>
    <h1>我是404组件</h1>
    {{userstore.NUMBER}}
</template>

<script setup lang="ts">
import useUserStore from '../../store/modules/user';
let userstore = useUserStore()

</script>

<style scoped>

</style>