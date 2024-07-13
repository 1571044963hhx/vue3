<template>
    <div>
        <input type="file" @change="fileChange" />
        <div class="btn">
            <el-button type="primary" @click="uploadBtn">点击上传</el-button>
            <el-button @click=merge>合并</el-button>
            <el-button type="primary">停止上传</el-button>
        </div>
        <div class="progress">
            <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage" status="success" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
// import { http } from '@/api/http.js'
import SparkMD5 from 'spark-md5'
import { ElMessage } from 'element-plus'
//存放切片文件
const fileList = ref([])
const fileMd5 = ref('')
const file = ref([])
let percentage = ref(0)

const http = ()=>{
    
}

//获取上传文件的基本信息
const fileChange = (e) => {
    file.value = e.target.files[0]
    percentage.value = 0
}

//切片函数
const uploadBtn = () => {
    //切片
    for (let i = 0; i < file.value.size; i += 1024 * 1024) {
        fileList.value.push(file.value.slice(i, i + 1024 * 1024))
    }
    console.log(fileList.value)
    // FileReader()用于读取file和blob里面的数据

    //84e76664ebf8695e85f0185af86ffa4b

    const hash = new SparkMD5.ArrayBuffer() // 构建hash值对象，用于计算hash值
    const fileReader = new FileReader()

    fileReader.onload = () => {
        //将一组字节加到里面，会自动完成增量算法
        hash.append(fileReader.result)
        fileMd5.value = hash.end()
        console.log(fileMd5.value)
        upload(0)
    }
    //file.value保存的是切片后的所有数据
    fileReader.readAsArrayBuffer(file.value)
}

const upload = async (index) => {
    if (index == fileList.value.length) {
        mergeUpload()
        return
    }
    //创建一个新的 FormData 对象，用于构建要发送的表单数据。
    // 将当前分片添加到 formData 对象中，键名为 'chunk'，值为当前索引对应的分片文件。
    // 将当前分片的索引添加到 formData 对象中，键名为 'index'，值为当前索引。
    //将分片的名字添加到 formData 对象中，键名为 'name'，值为文件的 MD5 哈希值加上当前索引，用于唯一标识每个分片。

    const formData = new FormData()
    console.log(fileMd5.value + '@' + index + '.' + file.value.type.split('/').pop())
    formData.append('chunk', fileList.value[index])
    formData.append('index', index)
    formData.append('name', fileMd5.value + '@' + index + '.' + file.value.type.split('/').pop())
    formData.append('filename', fileMd5.value)

    let res = await http.post('/upload', formData)

    console.log(res)

    if (res.code == 300) {
        //证明已经存在部分文件
        percentage.value = ((res.index / fileList.value.length) * 100).toFixed(2)
        upload(res.index + 1)
        console.log(index)
    } else if (res.code == 200) {
        percentage.value = (((index + 1) / fileList.value.length) * 100).toFixed(2)
        upload(index + 1)
    } else {
        upload(index)
    }
}

const merge = async () => {
    //合并请求
    let res = await http.post('/merge', {
        filename: '555',
        ext: file.value.type.split('/').pop()
    })
}
</script>

<style lang="scss" scoped>
.btn {
    margin: 10px 0;
}

.progress {
    width: 300px;
}
</style>