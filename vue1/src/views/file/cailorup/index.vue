<template>
    <div class="container">
        <!-- 当 act 值为 1 时显示的内容 -->
        <div class="box" v-if="act == 1">
            <div class="add">
                <!-- 文件选择输入框，隐藏 -->
                <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" />
                <!-- 显示一个图标用于触发文件选择 -->
                <el-icon size="200" color="#ccc" @click="openFileInput">
                    <Plus />
                </el-icon>
            </div>
        </div>
        <!-- 显示待裁剪的图片 -->
        <div class="photo-container" v-if="act == 2">
            <div class="photo-and-crop">
                <!-- 显示上传的图片 -->
                <img :src="base64Img" alt="" class="photo" />
                <!-- 裁剪框，用户可以拖动以选择裁剪区域 -->
                <div ref="cropBox" class="crop-box" @click="dragOpen" @mousemove="dragging"></div>
            </div>
        </div>
    </div>
    <!-- 裁剪图片按钮 -->
    <el-button type="primary" style="margin: 50px" @click="drawImage">裁剪图片</el-button>
    <!-- 用于显示裁剪后的图片 -->
    <div class="IMG"></div>
</template>

<script setup>
import { ref } from 'vue'
import { http } from '@/api/http'

// act 控制不同步骤的显示（1表示上传，2表示裁剪）
const act = ref(1)
// 文件输入框的引用
const fileInputRef = ref(null)
// 保存上传图片的 Base64 数据
const base64Img = ref('')
// 裁剪框的引用
const cropBox = ref(null)
// 裁剪框的偏移量
const offsetX = ref(0)
const offsetY = ref(0)
// 控制裁剪框是否可以拖动
const drag = ref(false)
// 裁剪后的图片
const cropImg = ref('')

// 触发文件选择
const openFileInput = () => {
    fileInputRef.value.click()
}

// 处理文件选择后的事件
const handleFileChange = (e) => {
    act.value = 2 // 切换到裁剪界面
    let file = e.target.files[0] // 获取用户选择的文件
    console.log(e.target.files[0])
    // 将图片文件转换为 Base64 以便预览
    const reader = new FileReader()
    reader.onload = (e) => {
        base64Img.value = e.target.result // 保存 Base64 数据以供显示
    }
    reader.readAsDataURL(file) // 开始读取文件
}

// 控制是否允许拖动裁剪框
const dragOpen = () => {
    drag.value = !drag.value
}

// 处理裁剪框的拖动
const dragging = (e) => {
    // 根据鼠标位置计算裁剪框的位置
    if (drag.value) {
        if (e.clientX > 445 && e.clientX < 694) {
            cropBox.value.style.left = e.clientX - 370 + 'px' // 设置裁剪框的左边距
            offsetX.value = e.clientX - 370 // 记录裁剪框的横向偏移量
            offsetY.value = e.clientY - 120 // 记录裁剪框的纵向偏移量
        }
        if (e.clientY > 195 && e.clientY < 444) {
            cropBox.value.style.top = e.clientY - 120 + 'px' // 设置裁剪框的上边距
            offsetX.value = e.clientX - 370 // 更新横向偏移量
            offsetY.value = e.clientY - 120 // 更新纵向偏移量
        }
        console.log(offsetX.value, offsetY.value)
    }
}

// 使用 canvas 绘制裁剪后的图片
const drawImage = () => {
    const canvas = document.createElement('canvas') // 创建一个 canvas 元素
    canvas.width = 200 // 设置 canvas 宽度
    canvas.height = 200 // 设置 canvas 高度
    const ctx = canvas.getContext('2d') // 获取 canvas 的 2D 上下文
    const image = new Image() // 创建一个 Image 对象
    image.src = base64Img.value // 设置 Image 的来源为上传的 Base64 图片
    image.onload = () => {
        // 当图片加载完成后，将其绘制到 canvas 上
        ctx.drawImage(image, offsetX.value, offsetY.value, 150, 150, 0, 0, 200, 200)
        document.querySelector('.IMG').appendChild(canvas) // 将裁剪后的图片添加到页面
    }
    // 将 canvas 内容转换为 Blob
    canvas.toBlob((blob) => {
        console.log(blob)
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' }) // 将 Blob 转换为 File 对象
        console.log(file)
        // 发送裁剪后的图片到服务器
        upload(file)
    }, 'image/jpeg')
}

// 上传裁剪后的图片到服务器
const upload = async (file) => {
    const formData = new FormData() // 创建一个 FormData 对象
    formData.append('file', file) // 将文件添加到 FormData 中
    let res = await http.post('/api/imageUpload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }) // 发送请求
    console.log(res) // 打印响应结果
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

    .add:hover {
        cursor: pointer;
    }
}

.photo-container {
    position: relative;
    display: inline-block;

    .photo-and-crop {
        position: relative;

        .photo {
            border: 1px solid #ccc;
            z-index: -1;
            width: 400px;
            height: 400px;
        }

        .crop-box {
            z-index: 1;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150px;
            height: 150px;
            border: 2px solid white;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.2);
        }
    }
}
</style>