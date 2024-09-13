<template>
    <category :scene="scene"></category>
    <el-card>
        <div class="view0" v-show="scene == 0">
            <el-button type="primary" icon="Plus" @click="addAttr"
                :disabled="categoryStore.c3Id ? false : true">添加平台属性</el-button>
            <!-- data里面的数据就是result.data，可以理解为把data解构了，里面的数据attrName可以直接使用 -->
            <el-table border style="width: 100%" :data="attrArr">
                <el-table-column label="序号" align='center' type="index" width="100px" />
                <!-- prop，type不用双引号 -->
                <el-table-column label="属性名称" align='center' width="200px" prop="attrName" />
                <el-table-column label="属性值名称" align='center'>
                    <template #="{ row, $index }">
                        <!-- 模板里面用{{item.valueName }}，而不是row，row可以理解为data里面的某个数据，插槽是遍历每一个row，而 item.valueName为遍历的单个数据-->
                        <!-- 有时候会这样写#="{ default }"，因此可以将{{item.valueName }}写为{{ default.row.valueName }}-->
                        <el-tag style="margin:5px" v-for="(item, index) in row.attrValueList" :key="item.id">{{item.valueName }}</el-tag>
                        <!-- </el-tag> 显示的是{{item.valueName }}的内容，而具体有多少行取决于row有多少个 -->
                    </template>
                </el-table-column>
                <el-table-column label="属性值操作" width="200px">
                    <!-- row：已有的属性对象 -->
                    <template #="{ row, $index }">
                        <!-- 修改已有属性的按钮 -->
                        <el-button type="primary" size="default" icon="Edit" @click="updateAttr(row)"></el-button>
                        <el-popconfirm :title="`你确定删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                            <template #reference>
                                <el-button size="default" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="view1" v-show="scene == 1">
            <el-form>
                <el-form-item label="属性名称" style="width: 300px;">
                    <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
                </el-form-item>

                <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary"
                    icon="Plus">添加属性值</el-button>
                <el-button style="width: 70px;" @click="cancel">取消</el-button>

                <el-table border :data="attrParams.attrValueList">
                    <el-table-column type="index" align='center' width="100px" label="序号"></el-table-column>
                    <el-table-column type="index" align='center' width="400px" label="属性值">
                        <template #="{ row, $index }">
                            <!-- :ref="(vc:any)=>inputArr[$index] = vc"  当组件内容发生变化时触发，且vc代表的是组件实例对象 -->
                            <el-input size="default" placeholder="请你输入属性值名称" v-model="row.valueName" 
                            :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)">
                            <!-- //给组件实例对象打标签，再利用组件实例对象自带的foucs自动聚焦 -->
                            </el-input>
                            <!-- 使用v-else时，其前一兄弟组件必须存在v-if函数 -->
                            <div style="text-align: left; margin-left: 10px;" v-else @click="toEdit(row, $index)" >
                                {{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align='center' width="200px" label="操作">
                        <template #="{ row, $index }">
                            <!-- index表示删除的第几项，1代表删除的项数，index从0开始计数，splice也是从第0项开始计数 -->
                            <el-button type="primary" icon="Delete"
                                @click="attrParams.attrValueList.splice(index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item>
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script lang="ts" setup>
import Category from '../../../components/Category/index.vue';
import { reqAddOrUpdateAttr, reqAttr, reqRemoveAttr } from '../../../api/product/attr';
import { watch, nextTick } from 'vue';
import { ref, reactive,onBeforeUnmount } from 'vue';
import useCategoryStore from '../../../store/category';
import type { Attr } from '../../../api/product/attr/type';
import { ElMessage } from 'element-plus';
let categoryStore = useCategoryStore()

let attrArr = ref<Attr[]>([])
let scene = ref<number>(0)

//由于input实例对象中包含focus函数，因此需要获取实例对象实现自动聚焦
let inputArr = ref<any>([]);


//收集新增的属性的数据
let attrParams = reactive<Attr>({
    attrName: "",//新增的属性的名字
    attrValueList: [
    ],
    categoryId: '',//三级分类的ID
    categoryLevel: 3,//代表的是三级分类
})

watch(() => categoryStore.c3Id, () => {
    //清空上一次查询的属性与属性值
    attrArr.value = [];
    //保证三级分类得有才能发请求
    if (!categoryStore.c3Id) return;
    //获取分类的ID
    getAttr();
})


const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let result: any = await reqAttr(c1Id, c2Id, c3Id);
    if (result.code == 200) {
        attrArr.value = result.data
    }
}
//添加属性按钮的回调
const addAttr = () => {
    //每一次点击的时候,先清空一下数据再收集数据
    //Object.assign  将后面的数据传给前面
    Object.assign(attrParams, {
        attrName: "",//新增的属性的名字
        attrValueList: [],
        //新增的属性值数组
        categoryId: categoryStore.c3Id,//三级分类的ID
        categoryLevel: 3,//代表的是三级分类
    })
    //切换为添加与修改属性的结构
    scene.value = 1;
}
//table表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
    //切换为添加与修改属性的结构
    scene.value = 1;
    //将已有的属性对象赋值给attrParams对象即为
    //ES6->Object.assign进行对象的合并,进行深拷贝
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
}
const addAttrValue = () => {
    // push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
    // 注意： 新元素将添加在数组的末尾。
    // 注意： 此方法改变数组的长度。
    // 提示： 在数组起始位置添加元素请使用 unshift() 方法。
    attrParams.attrValueList.push({
        valueName: '',
        flag: true,//控制每一个属性值编辑模式与切换模式的切换
    })
    //获取最后el-input组件聚焦
    nextTick(() => {
        //不能用$index,因为没有插槽
        inputArr.value[attrParams.attrValueList.length - 1].focus();
    })
}

//取消按钮的回调
const cancel = () => {
    scene.value = 0;
}

//保存属性值
const save = async () => {
    let resault = await reqAddOrUpdateAttr(attrParams);
    if (resault.code == 200) {
        scene.value = 0;
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改数据成功' : '添加数据成功'
        })
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改数据失败' : '添加数据失败'
        })
    }
}
const toLook = (row:any, $index:any) => {
    //删除空格，如果不加这个的话在输入框里面点击空格也会显示有字符串
    if (row.valueName.trim() == '') {
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return
    }

    let repeat = attrParams.attrValueList.find((item) => {
        if (item != row) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        attrParams.attrValueList.splice($index, 1);
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        return
    }
    //相应的属性值对象flag:变为false,展示div
    row.flag = false;
}
const toEdit = (row:any, $index:any) => {
    row.flag = true;
    //可以理解为等之前的步骤全部结束后再执行下一步操作
    nextTick(() => {
        inputArr.value[$index].focus();
    })
}



//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {

    //发相应的删除已有的属性的请求
    let result: any = await reqRemoveAttr(attrId);
    //删除成功
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        //获取一次已有的属性与属性值
        getAttr();
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
    //清空仓库的数据,$reset  pinia仓库自带的方法
    categoryStore.$reset();

})

</script>

<style lang="scss" scoped></style>