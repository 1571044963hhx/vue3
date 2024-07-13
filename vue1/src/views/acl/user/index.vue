<template>
    <el-card style="margin: 10px 10px">
        <el-form :inline="true">
            <el-form-item label="用户名">
                <el-input style="width: 240px" placeholder="Please input" v-model="keyword" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="serach">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 10px">
        <el-button type="primary" @click="addUser" v-has="`btn.User.add`">添加</el-button>
        <el-button type="danger" @click="batchRemove" :disabled="keyword?false:true">批量删除</el-button>
        <el-table @selection-change="selectChange" :data="userInfo" border>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="id" prop="id" width="100px"></el-table-column>
            <el-table-column label="用户名字" width="150px" prop="username"></el-table-column>
            <el-table-column label="用户昵称" width="150px" prop="name"></el-table-column>
            <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作">
                <template #="{ row, $index }">
                    <el-button type="primary" icon="View" @click="setRole(row)" v-has="`btn.User.assgin`">分配角色</el-button>
                    <el-button type="primary" icon="Edit" @click="updateUser(row)"></el-button>
                    <el-button type="primary" icon="Delete" @click="deleteUser(row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 4, 5, 8]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes," :total="total" @size-change="handler"
            @current-change="getHasUser" />
    </el-card>
    <el-drawer v-model="drawer">
        <template #header>
            <h4></h4>
        </template>
        <template #default>
            <div>
                <el-form ref="ruleFormRef" :model="userParams" :rules="rules" :scroll-to-error="true">
                    <el-form-item label="用户昵称：" prop="name">
                        <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户姓名：" prop="username">
                        <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码：" prop="password" v-if="userParams.id ? false : true">
                        <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </template>
    </el-drawer>
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色</h4>
        </template>
        <template #default>
            <div>
                <el-form>
                    <el-form-item label="用户名称">
                        <el-input :disabled="true" v-model="userParams.username"></el-input>
                    </el-form-item>
                    <el-form-item label="分配角色">
                        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                            @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="assignRoles" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="(role, index) in allRolesList" :key="index" :label="role" :value="role">{{
            role.roleName }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelSetRole">取消</el-button>
                <el-button type="primary" @click="confirmSetRole">确认</el-button>
            </div>
        </template>
    </el-drawer>

</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import { onMounted } from 'vue';
import { reqUserInfo, reqAddOrUpdateUser, reqSetRole, reqSetRoles, reqDeleteUser, reqBatchRemove } from '../../../api/acl/user/index';
import { ElMessage } from 'element-plus';
import  useLayOutSettingStore  from '../../../store/modules/setting'

let pageNo = ref(1)
let pageSize = ref(5)
let total = ref()
let userInfo = ref()
let drawer = ref(false)
let drawer1 = ref(false)
let userParams = reactive({
    id: '',
    name: '',
    password: '',
    username: '',
})
let ruleFormRef = ref()

const checkAll = ref(false)
const isIndeterminate = ref(true)
const assignRoles = ref()
const allRolesList: any = ref([])
let reqSetRolesId = {
    roleIdList: [],
    userId: ''
}
let idList =ref([]);
let keyword = ref('');
let settingStore = useLayOutSettingStore();


onMounted(() => {
    getHasUser()
})
const getHasUser = async (pager = 1) => {
    pageNo.value = pager
    let result: any = await reqUserInfo(pageNo.value, pageSize.value,keyword.value);
    if (result.code == 200) {
        userInfo.value = result.data.records;
        total.value = result.data.total
    }
}

const handler = () => {
    getHasUser()
}
const addUser = () => {
    Object.assign(userParams, {
        id: '',
        name: '',
        password: '',
        username: ''
    });
    drawer.value = true
    nextTick(() => {
        ruleFormRef.value.clearValidate(['name', 'username', 'password'])
    })
}
//validate	对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。也就是说成功的话就继续执行，失败则停止程序
const updateUser = async (row: any) => {
    drawer.value = true
    //row给的需要全部接受
    Object.assign(userParams, row)
}
//定义校验函数
const checkName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 5) {
        callback()
    } else {
        callback(new Error('用户名称的长度至少要大于6位'))
    }
}
const checkUserName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 5) {
        callback()
    } else {
        callback(new Error('用户姓名的长度至少要大于6位'))
    }
}
const checkPassword = (rule: any, value: any, callback: any) => {
    // if(value.trim().length>=5){
    //     callback()
    // }else{
    //     callback(new Error('用户密码的长度至少要大于6位'))
    // }
    let regex = new RegExp(
        '^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_]+$)(?![a-z0-9]+$)(?![a-z\\W_]+$)(?![0-9\\W_]+$)[a-zA-Z0-9\\W_]{8,20}$'
    )
    if (!regex.test(value)) {
        callback('密码必须同时包含大写、小写、数字和特殊字符其中三项且至少8位')
    } else {
        callback()
    }
}

//定义校验规则
const rules = ({
    name: [{ trigger: 'blur', validator: checkName }],
    username: [{ trigger: 'blur', validator: checkUserName }],
    password: [{ trigger: 'blur', validator: checkPassword }],
})
const save = async () => {
    await ruleFormRef.value.validate()
    drawer.value = false
    let result: any = await reqAddOrUpdateUser(userParams);
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '添加成功' })
        window.location.reload();
    } else {
        ElMessage({ type: 'error', message: '添加失败' })
    }
}
const cancel = () => {
    drawer.value = false
}

const setRole = async (row: any) => {
    drawer1.value = true
    Object.assign(userParams, row)
    let result: any = await reqSetRole(userParams.id)
    allRolesList.value = result.data.allRolesList
    assignRoles.value = result.data.assignRoles
}

const handleCheckAllChange = (val: any) => {
    assignRoles.value = val ? allRolesList.value : []
    isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: any) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allRolesList.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRolesList.length
}

const cancelSetRole = () => {
    drawer1.value = false
}
const confirmSetRole = async () => {
    reqSetRolesId.roleIdList = assignRoles.value.map((item: any) => {
        return item.id
    })
    reqSetRolesId.userId = userParams.id
    let result: any = await reqSetRoles(reqSetRolesId);
    console.log(result)
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '分配职务成功' });
        //关闭抽屉
        drawer1.value = false;
        //获取更新完毕用户的信息,更新完毕留在当前页
        getHasUser(pageNo.value);
    }
}

const deleteUser = async (userId: any) => {
    let result: any = await reqDeleteUser(userId)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        });
        getHasUser();
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
const batchRemove = async () => {
    let result:any = await reqBatchRemove(idList.value)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        });
        getHasUser();
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
const selectChange = (value:any)=>{
    idList.value = value.map((item:any)=>{
        return item.id
    })
}
const serach = ()=>{
    getHasUser()
}
const reset = () => {
    settingStore.refsh = !settingStore.refsh;
}

</script>
<style lang="scss" scoped></style>
