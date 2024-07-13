<template>
    <div class="layout_container" >
        <div class="layout_slider" :class="{ fold: LayOutSettingStore.fold ? true : false }">
            <logo></logo>
            <!--  -->
            <el-srcollbar class="scrollbar">
                <el-menu :collapse="LayOutSettingStore.fold?true:false"  background-color="#001529" text-color="white" :default-active="$route.path" active-text-color="yellowgreen">
                    <index :menuList="usestore.menuRoutes"></index>
                    <index1></index1>
                </el-menu>
            </el-srcollbar> 
        </div>
        <div class="layout_tabbar" :class="{ fold: LayOutSettingStore.fold ? true : false }">
            <tabbar></tabbar>
        </div>
        <div class="layout_main" :class="{ fold: LayOutSettingStore.fold ? true : false }">
            <Main></Main>
        </div>
    </div>
</template>

<script setup lang="ts">
import logo from './logo/index.vue';
import index from './menu/index.vue';
import index1 from './menu/index1.vue';
import useUserStore from '../store/modules/user'
import { useRoute } from 'vue-router';
import Main from "./main/index.vue"
import tabbar from "./tabbar/index.vue"
import useLayOutSettingStore from '../store/modules/setting';


let usestore = useUserStore();
let $route = useRoute();
let LayOutSettingStore=useLayOutSettingStore();




</script>


<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        color: white;
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);

            .el-menu {
                border-right: none;
            }
        }
    }

    .layout_tabbar {
        position: fixed;
        background-color: aquamarine;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        top: 0px;
        left: $base-menu-width;
        transition: all 0.3s;
        &.fold {
            width: calc(100vw - $base-menu-min-width );
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;

        &.fold {
            width: calc(100vw - $base-menu-min-width );
            left: $base-menu-min-width;
        }

    }
}
</style>