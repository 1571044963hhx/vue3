<template>
    <div>
        <input type="file" @change="fileChange" />
        <div class="btn">
            <el-button type="primary" @click="uploadBtn">点击上传</el-button>
            <el-button type="primary">停止上传</el-button>
        </div>
        <div class="progress">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage" status="success" />
            <el-input v-model="hhx"></el-input>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { reqUploadImg } from '../../../api/file/index'
import { ElMessage } from 'element-plus'

// 存放切片文件
let fileList = []
let fileMd5 = ''
const file = ref(null)
let percentage = ref(0)
const hhx = ref()
const http = ()=>{
}

// 创建 Web Worker 实例
let webworker = new Worker('http://localhost:5173/md5.js')

// 接收 Web Worker 计算完成的 MD5 值
webworker.addEventListener('message', (e) => {
    console.log(e.data)
    hhx.value = e.data
    fileMd5 = e.data
})

const fileChange = (e) => {
    file.value = e.target.files[0]
    percentage.value = 0

    // 向 Web Worker 传递文件进行 MD5 计算
    webworker.postMessage(file.value)
}

const uploadBtn = () => {
    // 切片操作
    for (let i = 0; i < file.value.size; i += 1024 * 1024) {
        fileList.push(file.value.slice(i, i + 1024 * 1024))
    }
    upload(0) // 开始上传
}
const upload = async (index) => {
    if (index === fileList.length) {
        ElMessage({
            type: 'success',
            message: '上传成功'
        })
        // mergeUpload()
        return
    }
    const formData = new FormData()
    formData.append('chunk', fileList[index])
    formData.append('index', index)
    formData.append('name', fileMd5 + '@' + index) // 名字
    formData.append('filename', fileMd5) // 文件名

    let res = await reqUploadImg(formData)
    console.log(res)

    if (res.code === 300) {
        // 证明已经存在部分文件
        percentage.value = ((res.index / fileList.length) * 100).toFixed(2)
        upload(res.index + 1)
    } else if (res.code === 200) {
        percentage.value = (((index + 1) / fileList.length) * 100).toFixed(2)
        upload(index + 1)
    } else {
        upload(index)
    }
}
// const mergeUpload = async () => {
//     // 合并请求
//     let res = await http.post('/api/merge_chunk', {
//         filename: fileMd5,
//         extname: file.value.type.split('/').pop()
//     })
//     if (res.code === 200) {
//         file.value = null
//         fileList = []
//         fileMd5 = ''
//         ElMessage({
//             type: 'success',
//             message: '上传成功'
//         })
//     }
// }
</script>

<style lang="scss" scoped>
.btn {
    margin: 10px 0;
}

.progress {
    width: 300px;
}
</style>