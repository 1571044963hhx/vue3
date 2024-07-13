<template>
    <div class="logo">
        <img src="../../../public/logo.png" alt="">
        <p>尚硅谷甄选运营平台</p>
        <!-- {{ setting.logo }}
        {{ setting.title }} -->
        
    </div>

</template>

<script setup lang="ts" name="logo">
// import setting from '../../setting';

</script>

<style scoped lang="scss">
.logo{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 10px;
    img{
        height: 50px;
        width: 50px;
    }
    p{
        font-size: 20px;
        margin-left: 10px;
    }
}

</style>
