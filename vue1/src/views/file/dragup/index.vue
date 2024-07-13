<template>
    <div class="container" :class="{ draging: dragStyle == true }" @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver" @drop.prevent="handleDrop">
        <el-icon size="200" class="icon" @click="handlerUpload">
            <UploadFilled />
        </el-icon>
        <input type="file" multiple @change="handlerChange" ref="fileInputRef" class="ipt" style="display: none" />
    </div>
    <!-- 这里显示已经拖拽上传了的文件 -->
    <el-table :data="fileListOver" style="width: 80%">
        <el-table-column prop="name" label="文件名" width="450" />
        <el-table-column prop="size" label="文件大小" width="200" />
        <!-- 控制显示 -->
        <el-table-column label="文件状态" width="300">
            <template #default="scope1">
                <span v-if="scope1.row.status == 'scuuess'" style="color: #67c23a">上传成功</span>
                <span v-if="scope1.row.status == 'error'" style="color: red">上传失败</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { ref } from 'vue'
import request from '../../../utils/request';
import { ElMessage } from 'element-plus'
let fileInputRef = ref(null)
//存放已经上传的文件的数组
let fileListOver = ref([])
//存放要上传的文件的数组
let fileList = ref([])
//拖拽样式
let dragStyle = ref(false)
// input的监听事件
const handlerChange = (e) => {
    //将点击上传的文件添加到fileList中
    fileList.value.push(...e.target.files)
    // 调用函数
    uploadFile()
}

const http = ()=>{
    
}

// 点击上传按钮
const handlerUpload = () => {
    fileInputRef.value.click()
}

// 处理拖拽进入
const handleDragEnter = (e) => {
    e.preventDefault()
    //添加拖拽样式
    dragStyle.value = true
}
// 处理拖拽过程中
const handleDragOver = (e) => {
    e.preventDefault() // 阻止默认行为
}
// 处理拖拽事件
const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    console.log('上传的文件:', files)
    //将要上传的文件放入数组中
    fileList.value.push(...files)
    dragStyle.value = false
    uploadFile()
}
//上传文件的函数
const uploadFile = async () => {
    //先要计算出要上传的文件的索引
    const index = fileListOver.value.length
    if (fileList.value.length == fileListOver.value.length) {
        //所有的数据都已经上传完毕，退出递归
        return
    }
    //存放文件数据
    let formData = new FormData()
    formData.append('file', fileList.value[index])
    console.log(formData)
    let res = await http.post('/upload', formData)
    if (res.code !== 200) {
        fileListOver.value.push({
            name: fileList.value[index].name,
            size: fileList.value[index].size > 1024 * 1024 ? (fileList.value[index].size / 1024 / 1024).toFixed(2) + 'mb' : (fileList.value[index].size / 1024).toFixed(2) + 'kb',
            status: 'error'
        })
        ElMessage({
            type: 'error',
            message: res.msg
        })
    } else {
        //将上传好的数据插入至fileListOver中
        fileListOver.value.push({
            name: fileList.value[index].name,
            size: fileList.value[index].size > 1024 * 1024 ? (fileList.value[index].size / 1024 / 1024).toFixed(2) + 'mb' : (fileList.value[index].size / 1024).toFixed(2) + 'kb',
            status: 'scuuess'
        })
        ElMessage({
            type: 'success',
            message: '上传成功'
        })
    }
    //开个定时器
    let timer = setTimeout(() => {
        uploadFile() //递归
        clearTimeout(timer)
    }, 1000)
}
</script>

<style lang="scss" scoped>
.container {
    width: 800px;
    height: 300px;
    margin: 20px 100px;
    border: 2px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;

    .ipt {
        width: 100%;
        height: 100%;
        opacity: 0;
        display: none;
    }

    .icon {
        color: #ccc;
    }

    .icon:hover {
        cursor: pointer;
    }

    //拖拽样式
    .draging {
        background-color: #ecf5ff;
        border: 2px dashed #eaebec;

        .icon {
            color: pink;
        }
    }
}
</style>