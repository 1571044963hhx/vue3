<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <component :is="Component" v-if="flag">
            </component>
        </transition>
    </router-view>
</template>

<script setup lang="ts" name="Main">
import useLayOutSettingStore from '../../store/modules/setting';
import { watch,ref,nextTick } from 'vue'
let LayOutSettingStore=useLayOutSettingStore();

let flag =ref(true);
watch(()=>LayOutSettingStore.refsh,()=>{
    flag.value=false
    nextTick(()=>{
        flag.value=true;
    })
})
</script>

<style scoped lang="scss">

</style>