<template>
    <el-form>
        <el-form-item label="spu名称">
            <el-input placeholder="请输入SPU名称" style="width: 500px;" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="spu品牌">
            <el-select style="width: 200px;" v-model="SpuParams.tmId">
                <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="spu描述">
            <el-input placeholder="请输入描述" style="width: 500px;" v-model="SpuParams.description"></el-input>
        </el-form-item>

        <el-form-item label="spu照片">
            <el-upload list-type="picture-card" v-model:file-list="imgList" action="/api/admin/product/fileUpload"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full:src="dialogImageUrl" alt="Preview Image" style="width:100%;height: 100%;" />
            </el-dialog>
        </el-form-item>

        <el-form-item label="spu销售属性">
            <el-select style="width: 200px;" :placeholder="`还有${3 - saleAttr.length}项没有选择`"
                v-model="saleAttrIdAndValueName">
                <!-- 当选中某个value值时，所选的值会自动传给v-model -->
                <el-option :value="`${item.id}:${item.name}`" v-for="(item, index) in unSelectSaleAttr" :key="item.id"
                    :label="item.name"></el-option>
            </el-select>
            <el-button icon="Plus" type="primary" @click="addSaleValue":disabled="saleAttrIdAndValueName ? false : true">添加销售属性</el-button>
        </el-form-item>


        <el-form-item>
            <el-table :data="saleAttr" border>
                <el-table-column label="序号" type="index" align="center" width="100px"></el-table-column>
                <el-table-column label="属性" prop="saleAttrName" align="center" width="200px"></el-table-column>
                <el-table-column label="属性值" align="center">
                    <template #="{ row, $index }">
                        <el-tag style="margin:0px 5px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                            v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1" closable>
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input style="width: 100px;" @blur="toLook(row)" placeholder="请你输入属性值"
                            v-model="row.saleAttrValue" v-if="row.flag == true"></el-input>
                        <el-button v-else type="primary" size="small" icon="Plus" @click="toEdit(row)"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" icon="Delete"
                            @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save" :disabled="saleAttr.length > 0 ? false : true"> 保存 </el-button>
            <el-button @click="cancel"> 取消 </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup name="Spuform">
//存储已有的SPU这些数据
let AllTradeMark = ref([]);
//商品图片
let imgList = ref([]);
//已有的SPU销售属性
let saleAttr = ref([]);
//全部销售属性
let allSaleAttr = ref([]);
//存储已有的SPU对象
let SpuParams = ref({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});
//控制对话框的显示与隐藏
let dialogVisible = ref(false);
//存储预览图片地址
let dialogImageUrl = ref('')
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref('')
const $emit = defineEmits(['change0Scene'])



import { reqALLSaleAttr, reqSpuImageList, reqSpuHasSaleAttr, reqAllTradeMark, reqAddOrUpdateSpu } from '../../../api/product/spu';
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
const cancel =()=>{
    $emit('change0Scene',{flag:0,params:'update'})
}
//更新
const initHasSpuData = async (spu) => {
    SpuParams.value = spu;

    let result = await reqAllTradeMark();
    AllTradeMark.value = result.data;

    let result1 = await reqSpuImageList(spu.id);
    imgList.value = result1.data.map((item) => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    let result2 = await reqSpuHasSaleAttr(spu.id);
    saleAttr.value = result2.data;

    let result3 = await reqALLSaleAttr()
    allSaleAttr.value = result3.data;
}
//添加
const initAddSpu = async(c3Id)=>{
     //清空数据
     Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    });
    //清空照片
    imgList.value = [];
    //清空销售属性
    saleAttr.value = [];
    saleAttrIdAndValueName.value  = '';
    SpuParams.value.category3Id = c3Id;

    let result = await reqAllTradeMark();
    AllTradeMark.value = result.data;

    let result1 = await reqALLSaleAttr()
    allSaleAttr.value = result1.data; 
}

//预览，其中包含自带的参数file，为点击的文件元素
const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url;
    //对话框弹出来
    dialogVisible.value = true;
}
//移除，其中包含自带的参数file，为点击的文件元素
const handleRemove = (file) => {

}
const handlerUpload = (file) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件务必小于3M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件务必PNG|JPG|GIF'
        })
        return false;
    }
}
const toEdit = (row) => {
    row.flag = true;
    //这个不能和所有的销售属性相同，allsaleAttr
    row.saleAttrValue = ''
}

//表单元素失却焦点的事件回调
const toLook = (row) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式
    let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue
    }

    //非法情况判断
    if (saleAttrValue.trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的'
        })
        return;
    }
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}
const addSaleValue = () => {
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':');
    //准备一个新的销售属性对象:将来带给服务器即可
    let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组当中
    saleAttr.value.push(newSaleAttr);
    //清空收集的数据
    saleAttrIdAndValueName.value = '';
}

let unSelectSaleAttr = computed(() => {
    let unSelectArr = allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName;
        });
    })
    return unSelectArr;
})

const save = async () => {
    //储存图片数据
    SpuParams.value.spuImageList = imgList.value.map((item) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url//或
            // 只要“&&”前面是false，无论“&&”后面是true还是false，结果都将返“&&”前面的值；
            // 只要“&&”前面是true，无论“&&”后面是true还是false，结果都将返“&&”后面的值；
        }
    })
    //储存属性值数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    let result = await reqAddOrUpdateSpu(SpuParams.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '修改成功'
        })
        $emit('change0Scene',{flag:0,params:SpuParams.value.id?'update':'add'})
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '修改失败'
        })
    }
}

defineExpose({ initHasSpuData,initAddSpu })

</script>

<style scoped lang="scss"></style>
