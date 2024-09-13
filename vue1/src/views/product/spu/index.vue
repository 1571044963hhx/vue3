<template>
    <Category :scene="scene"></Category>
    <div>
        <div v-show="scene == 0">
            <el-card style="margin: 10px;">
                <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                    @click="change1Scene">添加SPU</el-button>
                <el-table :data="spuAttr">
                    <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                    <el-table-column label="SPU属性" align="center" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" align="center" prop="description"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column label="SPU操作" align="center">
                        <template #="{ row, $index }">
                            <el-button type="primary" icon="Edit" size="small" @click="updateScene(row)"></el-button>
                            <el-button type="primary" icon="View" size="small" @click="show(row)"></el-button>
                            <el-button type="primary" icon="Delete" size="small" @click="deleteSpu(row)"></el-button>
                            <el-button type="primary" icon="Plus" size="small" @click="addSku(row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div>
                    <el-pagination v-model:current-page="pageNO" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                        :background="true" layout="prev, pager, next, jumper,->,total, sizes," :total="total"
                        @current-change="getHasSpu" @size-change="changeSize" />
                </div>
            </el-card>
        </div>
        <el-card style="margin: 10px;" v-show="scene == 1">
            <Spuform ref="spu" @change0Scene="change0Scene"></Spuform>
        </el-card>
        <el-card style="margin: 10px;" v-show="scene == 2">
            <Skuform ref="sku" @change0Scene="change0Scene"></Skuform>
        </el-card>
        <el-dialog v-model="dialogVisible">
            <el-table :data="skuAttr">
                <el-table-column label="型号" prop="skuName"></el-table-column>
                <el-table-column label="SKU图片">
                    <template #="{ row, $index }">
                        <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import useCategoryStore from '../../../store/category'
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '../../../api/product/spu'
import { ref, watch } from 'vue'
import { onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';

import Skuform from './Skuform.vue';
import Spuform from './Spuform.vue';

let pageNO = ref(1);
let pageSize = ref(3);
//存储已有的SPU的数据
let spuAttr = ref([]);
let total = ref();
let scene = ref(0);
let categoryStore = useCategoryStore();
let spu = ref();
let sku = ref();
//存储已有的SKU的数据
let skuAttr = ref([])
let dialogVisible = ref(false)


const change1Scene = () => {
    scene.value = 1
    spu.value.initAddSpu(categoryStore.c3Id);
}
const change0Scene = (obj: any) => {
    //子组件Spuform点击取消变为场景0:展示已有的SPU
    scene.value = obj.flag;
    if (obj.params == 'update') {
        //更新留在当前页
        getHasSpu(pageNO.value);
    } else {
        //添加留在第一页
        getHasSpu();
    }
}
const updateScene = (row: any) => {
    scene.value = 1
    spu.value.initHasSpuData(row);
}
const addSku = (spu: any) => {
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, spu);
    scene.value = 2
}

watch(() => categoryStore.c3Id, () => {
    //当三级分类发生变化的时候清空对应的数据
    spuAttr.value = [];
    //务必保证有三级分类ID
    if (!categoryStore.c3Id) return;
    getHasSpu();
})
const getHasSpu = async (pager = 1) => {
    pageNO.value = pager;
    let result = await reqHasSpu(pageNO.value, pageSize.value, categoryStore.c3Id);
    console.log(result)
    if (result.code == 200) {
        spuAttr.value = result.data.records
        total.value = result.data.total;
    }
}
const show = async (row: any) => {
    dialogVisible.value = true
    let result = await reqSkuList(row.id);
    skuAttr.value = result.data
    console.log(skuAttr.value)
}
const changeSize = () => {
    getHasSpu();
}
//删除已有的SPU按钮的回调
const deleteSpu = async (row: any) => {
    let result: any = await reqRemoveSpu((row.id as number));
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        });
        //获取剩余SPU数据
        getHasSpu(spuAttr.value.length > 1 ? pageNO.value : pageNO.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}



//路由组件销毁前，情况仓库关于分类的数据
onBeforeUnmount(() => {
    categoryStore.$reset();
})

</script>

<style lang="scss" scoped></style>