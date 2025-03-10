<template>
    <div class="top">
        <ChatContent :showCursor="showCursor" :content="content"></ChatContent>
    </div>
    <div class="input-container">
        <textarea class="txt" rows="1" @input="handleChange"></textarea>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const markdown = `# 实现AJAX的两种方式
AJAX可以通过以下两种方式来实现：
// ...
\`\`\` `

const content = ref('')
const showCursor = ref(true)
let index = 0
let timerId = setInterval(() => {
    if (index >= markdown.length) {
        clearInterval(timerId)
        showCursor.value = false
        return
    }
    content.value += markdown[index++]
}, 100)

const handleChange = (e: any) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
}

</script>

<style scoped>
.input-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
}

.txt {
    border: 1px solid #ccc;
    outline: none;
    font-size: 16px;
    display: block;
    width: 20%;
    resize: none;
    line-height: 1.5;
    background: #fff;
    color: #000;
    border-radius: 8px;
    padding: 12px 48px;
    /* 增加左右 padding，给图标留空间 */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease-in-out;
    overflow: hidden;
}

.txt:focus {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-color: #0078d4;
    background: #f7f7f7;
}

.input-container::before {
    content: "\1F4CE";
    /* 附加文件的图标 (例如📎) */
    position: absolute;
    left: 12px;
    /* 左边的图标距离左侧的间距 */
    font-size: 20px;
    /* 图标大小 */
    color: #888;
    /* 图标颜色 */
    pointer-events: none;
    /* 让图标不可点击 */
}

.input-container::after {
    content: "\1F4E4";
    /* 上传按钮的图标 (例如📤) */
    position: absolute;
    right: 81%;
    /* 右边的图标距离右侧的间距 */
    font-size: 20px;
    /* 图标大小 */
    color: #888;
    /* 图标颜色 */
    cursor: pointer;
    /* 让右边图标看起来像个按钮 */
}
</style>