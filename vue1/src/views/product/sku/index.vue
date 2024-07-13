<template>
    <el-card>
        <el-table border style="margin: 10px 0px;" :data="skuArr">
            <el-table-column type="index" label="序号" width="120px" align="center"></el-table-column>
            <el-table-column label="名称" width="250px" align="center" prop="skuName"></el-table-column>
            <el-table-column label="描述" width="250px" align="center" prop="skuDesc"
                show-overflow-tooltip></el-table-column>
            <el-table-column label="图片" width="220px" align="center">
                <template #="{ row, $index }">
                    <img :src="row.skuDefaultImg" style="height: 100px; width: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="重量" width="220px" align="center" prop="weight"></el-table-column>
            <el-table-column label="价格" width="220px" align="center" prop="price"></el-table-column>
            <el-table-column label="操作" width="325px" align="center" fixed="right">
                <template #="{ row, $index }">
                    <el-button type="primary" :icon="row.isSale == 1 ? 'Top' : 'Bottom'"
                        @click="updateSale(row)"></el-button>
                    <el-button type="primary" icon="Edit" @click="updateSku"></el-button>
                    <el-button type="primary" icon="InfoFilled" @click="showSkuInfo(row)"></el-button>
                    <el-popconfirm :title="`你确定要删除${row.skuName}`"  @confirm="removeSku(row.id)">
                        <template #reference>
                            <el-button type="primary" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>          
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 4, 5, 6]"
                :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total"
                @size-change="handler" @current-change="getHasSku" />
        </div>
        <el-drawer v-model="drawer" :with-header="false">
            <span :style="{ fontSize: '30px', color: 'red', fontWeight: 'bold', fontFamily: '宋体' }">商品属性详情</span>
            <el-row style="margin: 30px 0px;">
                <el-col :span="6">名称:</el-col>
                <el-col :span="18">{{ drawerValue.skuName }}</el-col>
            </el-row>
            <el-row style="margin: 30px 0px;">
                <el-col :span="6">描述:</el-col>
                <el-col :span="18">{{ drawerValue.skuDesc }}</el-col>
            </el-row>
            <el-row style="margin: 30px 0px;">
                <el-col :span="6">价格:</el-col>
                <el-col :span="18">{{ drawerValue.price }}</el-col>
            </el-row>
            <el-row style="margin: 30px 0px;">
                <el-col :span="6">属性:</el-col>
                <el-col :span="18">
                    <el-tag v-for="(item, index) in drawerValue.skuAttrValueList" :key='item.id' style="margin: 5px 5px;">{{
            item.attrName
        }}</el-tag>
                </el-col>
            </el-row>
            <el-row style="margin: 30px 0px;">
                <el-col :span="6">图片:</el-col>
                <el-col :span="18">
                    <el-carousel :interval="4000" type="card" height="80px">
                        <el-carousel-item v-for="item in drawerValue.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" alt="" style="height: 100%; width: 100%;">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>      
    </el-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { reqGetSku, reqCancelSale, reqOnSale, reqGetSkuInfo,reqDelete } from '../../../api/product/sku/index'
import { ElMessage } from 'element-plus';

let pageNo = ref(1)
let pageSize = ref(5)
let total = ref()
let skuArr = ref([])
let drawer = ref(false)
let drawerValue = ref()

onMounted(() => {
    getHasSku()
})

const getHasSku = async (pager = 1) => {
    // @current-change方法会自动传入当前页码，也就是当前pager不一定是1，如果没有传入当前页码才会使用默认页码1
    pageNo.value = pager
    let result = await reqGetSku(pageNo.value, pageSize.value)
    skuArr.value = result.data.records
    total.value = result.data.total
}
const handler = () => {
    getHasSku()
}
const updateSale = async (row: any) => {
    console.log(row)
    if (row.isSale == 1) {
        await reqCancelSale(row.id)
        ElMessage({ type: 'success', message: '下架成功' })
        getHasSku(pageNo.value)
    } else {
        await reqOnSale(row.id)
        ElMessage({ type: 'success', message: '上架成功' })
    }
}
const updateSku = () => {
    ElMessage({
        type: 'success',
        message: '工作人员正在紧急更新中，尽请期待！'
    })

}
const showSkuInfo = async (row: any) => {
    drawer.value = true
    let result = await reqGetSkuInfo(row.id)
    drawerValue.value = result.data
}

//删除某一个已有的商品
const removeSku = async (id: number) => {
    //删除某一个已有商品的情况
    let result: any = await reqDelete(id);
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '删除成功' });
        //获取已有全部商品
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
    } else {
        //删除失败
        ElMessage({ type: 'error', message: '系统数据不能删除' });
    }
}
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>