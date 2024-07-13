<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <breadcrumb></breadcrumb>
        </div>

        <div class="tabbar_right">
            <setting></setting>
        </div>
    </div>


</template>

<script lang="ts" setup name="tabbar">
import breadcrumb from "./breadcrumb/index.vue"
import setting from "./setting/index.vue"


</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .tabbar_left {
        display: flex;
        align-items: center;
        margin-left: 20px;

    }

    .tabbar_right {
        display: flex;
        align-items: center;
    }
}
</style>