<template>
    <el-card style="margin: 10px;">
        <el-form :inline="true">
            <el-form-item label="角色名称">
                <el-input placeholder="角色名称" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" :disabled="keyword ? false : true">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin:10px;">
        <el-button type="primary" style="margin-bottom: 10px;" @click="addRole" v-has="`btn.Role.add`">添加角色</el-button>
        <el-table :data="roleArr" border>
            <el-table-column label="#" type="index" align="center" width="80px"></el-table-column>
            <el-table-column label="Id" prop="id" align="center" width="100px"></el-table-column>
            <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime" align="center"></el-table-column>
            <el-table-column label="操作" width="400px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" icon="User" @click="setPermission(row)">分配权限</el-button>
                    <el-button type="primary" icon="Edit" @click="editRole(row)">编辑</el-button>
                    <el-button type="primary" icon="Delete" @click="removeRole(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[4, 5, 6, 7]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total" @size-change="handler"
            @current-change="getHasRole" />
    </el-card>
    <el-dialog v-model="show" title="添加角色" width="500" align-center>
        <div>
            <el-form style="margin-top: 30px; margin-bottom: 30px;">
                <el-form-item label="角色名称:">
                    <el-input v-model="addrole.roleName"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="save">确认</el-button>
                <el-button @click="show = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="show1" title="编辑角色" width="500" align-center>
        <div>
            <el-form style="margin-top: 30px; margin-bottom: 30px;">
                <el-form-item label="角色名称:">
                    <el-input v-model="addrole.roleName"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="save1">确认</el-button>
                <el-button @click="show1 = false">取消</el-button>
            </div>
        </template>
    </el-dialog>
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配权限</h4>
        </template>
        <template #default>
            <div>
                <el-tree style="max-width: 400px" :data="menuArr" show-checkbox node-key="id" default-expand-all
                    :props="defaultProps" :default-checked-keys="checkedArr" ref="tree" />
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确认</el-button>
            </div>
        </template>
    </el-drawer>

</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { reqGetRole, reqAddRole, reqUpdataRole, reqSetPermission, reqSetPermisstion, reqRemoveRole } from '../../../api/acl/role/index'
import useLayOutSettingStore from '../../../store/modules/setting'
import { ElMessage } from 'element-plus';

let pageNo: any = ref(1)
let pageSize = ref(4)
let total = ref()
let keyword = ref('')
let roleArr = ref()
let layOutSettingStore = useLayOutSettingStore()
//控制添加角色对话框的显示与隐藏
let show = ref(false)
//控制编辑角色对话框的显示与隐藏
let show1 = ref(false)
//控制节点的勾选情况
const checkedArr: any = ref([])
let tree = ref()

let addrole = reactive({
    id: 0,
    roleName: ''
})
let drawer = ref(false)
let menuArr = ref()



onMounted(() => {
    getHasRole()
})
const handler = () => {
    getHasRole()
}
const getHasRole = async (pager = 1) => {
    pageNo.value = pager
    let result = await reqGetRole(pageNo.value, pageSize.value, keyword.value)
    roleArr.value = result.data.records
    total.value = result.data.total
}
const search = () => {
    getHasRole()
}
const reset = () => {
    layOutSettingStore.refsh = !layOutSettingStore.refsh
}
//添加角色
const addRole = () => {
    show.value = true
    addrole.roleName = ''
}
const save = async () => {
    let result: any = await reqAddRole(addrole)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加成功'
        })
    } else {
        ElMessage({
            type: 'error',
            message: '添加失败'
        })
    }
    show.value = false
    getHasRole()
}
//编辑角色
const editRole = (row: any) => {
    Object.assign(addrole, row)
    show1.value = true
}
const save1 = async () => {
    let result: any = await reqUpdataRole(addrole);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '修改成功'
        })
    } else {
        ElMessage({
            type: 'error',
            message: '修改失败'
        })
    }
    show1.value = false
    getHasRole(pageNo.value)
}

//分配权限
const confirmClick = async () => {
    //职位的ID
    const roleId = (addrole.id as number);
    //选中节点的ID
    let arr = tree.value.getCheckedKeys();
    //半选的ID
    let arr1 = tree.value.getHalfCheckedKeys();
    let permissionId = arr.concat(arr1);
    //下发权限
    let result: any = await reqSetPermisstion(roleId, permissionId);
    if (result.code == 200) {
        //抽屉关闭
        drawer.value = false;
        //提示信息
        ElMessage({ type: 'success', message: '分配权限成功' });
        //页面刷新
        window.location.reload();
    }
}
const setPermission = async (row: any) => {
    drawer.value = true
    Object.assign(addrole, row)
    let result: any = await reqSetPermission(addrole.id);
    menuArr.value = result.data
    console.log(menuArr.value)
    checkedArr.value = filterSelectArr(menuArr.value, [])
}

const filterSelectArr = (allData: any, initArr: any) => {
    allData.map((item: any) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id);
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr);
        }
    })
    return initArr;
}

const defaultProps = {
    children: 'children',
    label: 'name',
}

//删除已有的职位
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id);
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '删除成功' });
        getHasRole(roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
    }
}
</script>

<style lang="scss" scoped></style>