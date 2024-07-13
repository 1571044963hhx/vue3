<template>
    <el-card style="margin: 10px; height: 100px;">
        <el-form :inline="true">
            <el-form-item label="一级分类" style="margin-right: 100px; height: 30px; width: 200px;" >
                <el-select @change="handler" v-model="categoryStore.c1Id" :disabled="scene==0?false:true">
                    <!-- label:即为展示数据 value:即为select下拉菜单收集的数据 -->
                    <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类" style="margin-right: 100px; height: 30px; width: 200px;" >
                <el-select v-model="categoryStore.c2Id" @change="handler1" :disabled="scene==0?false:true">
                    <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类" style="margin-right: 100px; height: 30px; width: 200px;">
                <el-select v-model="categoryStore.c3Id" :disabled="scene==0?false:true">
                    <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name"
                        :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup name="Category">

import { onMounted } from 'vue';
import useCategoryStore from '../../store/category';
let categoryStore = useCategoryStore();

defineProps(['scene'])



onMounted(() => {
    categoryStore.getC1();
    console.log(categoryStore.c1Arr)
})
//此方法即为一级分类下拉菜单的change事件(选中值的时候会触发,保证一级分类ID有了)
const handler = () => {
    //需要将二级、三级分类的数据清空
    categoryStore.c2Id = '';
    categoryStore.c3Arr = [];
    categoryStore.c3Id = '';
    //通知仓库获取二级分类的数据
    categoryStore.getC2();
}
//此方法即为二级分类下拉菜单的change事件(选中值的时候会触发,保证二级分类ID有了)
const handler1 = () => {
    //清理三级分类的数据
    categoryStore.c3Id = '';
    categoryStore.getC3();
}


</script>

<style lang="scss" scoped></style>