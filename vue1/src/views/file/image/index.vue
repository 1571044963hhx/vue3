<template>
    <div class="box">
        <div class="add">
            <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" />
            <el-icon size="100" color="#ccc" v-if="act == 1" @click="openFileInput">
                <Plus />
            </el-icon>
            <!-- loading效果 -->
            <div class="loading" v-if="act == 2"></div>
            <img :src="base64Img" alt="" v-if="act == 2" />
        </div>
    </div>
    <div class="imgList">
        <ul>
            <li v-for="item in imgList"><img :src="item" alt="" /></li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { reqUploadImg } from '../../../api/file/index'
import { ElMessage } from 'element-plus'

let act = ref(1)

const fileInputRef = ref(null)
let selectedFile = ref(null)

let base64Img = ref('')
let imgList = ref([])
//上传函数
const openFileInput = () => {
    // 点击图标时触发文件选择框(获取input元素，并进行点击事件)
    fileInputRef.value.click()
}
//@change 事件的执行时机是用户通过文件选择对话框选择文件并确认后，即关闭文件选择对话框时。
const handleFileChange = async (event) => {
    // 处理文件选择事件(加载中，获取上传的文件，如果没有上传则返回)
    act.value = 2
    selectedFile.value = event.target.files[0]

    // console.log(selectedFile.value)
    if (!selectedFile.value) {
        return
    }

    // 将图片转为base64显示loading状态
    const reader = new FileReader()
    reader.onload = (event) => {
        base64Img.value = event.target.result
    }
    reader.readAsDataURL(selectedFile.value) //调用生成base64

    // 创建一个FormData对象来包装文件
    //  append 方法用于向 FormData 对象添加数据。
    // 'file' 是键名，表示文件数据在服务器端的字段名。
    // selectedFile.value是文件对象

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // 使用上传图片的接口函数发送请求
    console.log(formData)
    let res = await reqUploadImg(formData)
    if (res.code !== 200) {
        ElMessage({
            type: 'error',
            message: '上传失败'
        })
        act.value = 1
        return
    }
    //成功
    //开个定时器(为了看到上传的加载效果)
    else {
        let timer = setInterval(() => {
            act.value = 1
            clearInterval(timer)
            imgList.value.push(res.imgUrl)
            ElMessage({
                type: 'success',
                message: '上传成功'
            })
        }, 1000)
    }
}
</script>

<style lang="scss" scoped>
.box {
    width: 350px;
    height: 350px;
    border: 2px dashed rgb(175, 171, 171);
    border-radius: 2em;
    display: flex;
    justify-content: center;
    align-items: center;

    .add {
        position: relative;

        .loading {
            width: 100px;
            height: 100px;
            position: absolute;
            top: 35%;
            left: 35%;
            border: 3px solid #302b2b;
            border-top-color: transparent;
            border-radius: 50%;
            animation: circle infinite 0.75s linear;
        }

        // 转转转动画
        @keyframes circle {
            0% {
                transform: rotate(0);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        img {
            width: 350px;
            height: 350px;
            z-index: -1;
            // 增加点模糊透明度
            opacity: 0.5;
        }
    }

    .add:hover {
        cursor: pointer;
    }
}

.imgList {
    width: 60%;
    // background-color: pink;
    margin-top: 30px;

    ul {
        border: 1px solid #ccc;
        border-radius: 20px;
        display: flex;
        flex-wrap: wrap;
        padding-left: 20px;

        li {
            width: 200px;
            height: 200px;
            margin: 5px 6px;

            // border: 1px solid pink;
            img {
                width: 100%;
                border-radius: 20px;
                height: 100%;
            }
        }
    }
}
</style>