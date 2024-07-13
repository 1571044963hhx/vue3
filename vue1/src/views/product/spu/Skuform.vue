<template>
    <el-form label-width="90px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格（元）">
            <el-input placeholder="价格（元）" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量（克）">
            <el-input placeholder="重量（克）" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>

        <el-form-item :inline="true" label="平台属性">
            <el-form-item style="width: 450px; padding-bottom: 15px" v-for="(item, index) in arrAttr"
                :label="item.attrName" :key="item.id">
                <el-select placeholder="Select" v-model="item.arrIdAndValueId">
                    <el-option v-for="(item1, index) in item.attrValueList" :label="item1.valueName" :key="item1.id"
                        :value="`${item.id}:${item1.id}`"></el-option>
                </el-select>
            </el-form-item>
        </el-form-item>

        <el-form-item label="销售属性" :inline="true">
            <el-form-item v-for="(item, index) in saleAttr" :label="item.saleAttrName">
                <el-select style="width: 360px;" v-model="item.saleIdAndValueId">
                    <el-option v-for="(item1, index) in item.spuSaleAttrValueList" :label="item1.saleAttrValueName"
                        :key="item1.id" :value="`${item.id}:${item1.id}`"></el-option>
                </el-select>
            </el-form-item>
        </el-form-item>

        <el-form-item label="图片名字">
            <el-table border :data="imgAttr" ref="table">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column label="图片" align="center">
                    <template #="{ row, $index }">
                        <img :src="row.imgUrl" width="80px" height="80px">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #="{ row, $index }">
                        <el-button type="primary" @click="handler(row)">设置</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { tableV2CellProps } from 'element-plus/es/components/table-v2/src/cell.mjs';
import { reqAttr } from '../../../api/product/attr/index'
import { reqSpuHasSaleAttr, reqSpuImageList, reqAddSku } from '../../../api/product/spu/index';
import { reactive, ref } from 'vue';

let arrAttr = ref([]);
let saleAttr = ref([]);
let imgAttr = ref([]);

let skuParams = reactive({
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName: '',
    price: '',
    weight: '',
    skuDesc: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: ''
})

const $emit = defineEmits(['change0Scene'])
const cancel = () => {
    $emit('change0Scene', { flag: 0 })
}
// const save = () => {
//     //整理数据
//     console.log(arrAttr.value)
//     console.log(saleAttr.value)
//     skuParams.skuSaleAttrValueList = arrAttr.value.map((item)=>{
//         if(item.arrIdAndValueId){
//             return [attrId, valueId] = item.arrIdAndValueId.split(':')                     
//         }
//     })
// }
//保存按钮的方法
const save = async () => {
    //整理参数
    //平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev, next) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split(':');
            prev.push({
                attrId,
                valueId
            })
        }
        return prev;
    }, []);
    //销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev, next) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
            prev.push({
                saleAttrId, saleAttrValueId
            })
        }
        return prev;
    }, []);
    //添加SKU的请求
    let result= await reqAddSku(skuParams);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SKU成功'
        });
        //通知父组件切换场景为零
        $emit('changeScene',{flag:0,params:''})
    } else {
        ElMessage({
            type: 'error',
            message: '添加SKU失败'
        })
    }
}





const initSkuData = async (c1Id, c2Id, spu) => {
    skuParams.category3Id = spu.category3Id
    skuParams.spuId = spu.id
    skuParams.tmId = spu.tmId
    //获取平台属性
    let result = await reqAttr(c1Id, c2Id, spu.category3Id);
    //获取销售属性
    let result1 = await reqSpuHasSaleAttr(spu.id);
    //获取SPU照片数据
    let result2 = await reqSpuImageList(spu.id);
    arrAttr.value = result.data
    saleAttr.value = result1.data
    imgAttr.value = result2.data
    console.log(arrAttr.value)
    console.log(saleAttr.value)
    console.log(imgAttr.value)
}
//设置默认图片的方法回调
const handler = (row) => {
    //点击的时候,全部图片的的复选框不勾选
    imgAttr.value.forEach((item) => {
        table.value.toggleRowSelection(item, false);
    });
    //选中的图片才勾选
    table.value.toggleRowSelection(row, true);
    //收集图片地址
    skuParams.skuDefaultImg = row.imgUrl;
}

defineExpose({ initSkuData })
</script>

<style scoped lang="scss"></style>
