<template>
    <!-- 容器，包含markdown渲染区域和光标 -->r  
    <div class="container">
        <!-- 渲染Markdown内容的div，使用v-html将内容插入 -->
        <div class="markdown-body" v-html="markdownContent" ref="contentRef"></div>
        <!-- 光标元素，根据showCursor的值决定是否显示光标 -->
        <div class="cursor" v-show="showCursor"></div>
    </div>
</template>

<script setup lang="ts">
import 'github-markdown-css/github-markdown-dark.css' // 引入GitHub风格的markdown样式（深色）
import { marked } from 'marked' // 导入marked库用于解析markdown内容
import { computed, ref, reactive, onMounted, onUpdated, nextTick } from 'vue' // Vue中的响应式API
import hljs from 'highlight.js' // 导入highlight.js用于代码高亮
import 'highlight.js/styles/dark.css' // 引入highlight.js的深色主题样式

// 定义组件的props属性
const props = defineProps({
    content: {
        type: String, // markdown内容，类型为字符串
        required: true, // 必须传入该prop
    },
    showCursor: {
        type: Boolean, // 控制光标显示的布尔值
        default: false, // 默认值为falsedqs5eys6
    },
})

// 创建一个响应式对象用于记录光标的位置
const pos = reactive({ x: 0, y: 0 })
const cursorHeight = ref(16);  // 默认设置为 16px
// 获取markdown内容的容器引用
const contentRef = ref(null)

onMounted(() => {
    updateCursor()  // 初次加载时更新光标位置
})

const getLastTextNode = (dom) => {
    if (!dom) return null;  // 增加空值检查
    const children = dom.childNodes;
    for (let i = children.length - 1; i >= 0; i--) {
        const node = children[i]
        if (node.nodeType == Node.TEXT_NODE && /\S/.test(node.nodeValue)) {
            node.nodeValue = node.nodeValue.replace(/\s+$/, '')  // 去除文本末尾的空白字符
            return node
        } else if (node.nodeType == Node.ELEMENT_NODE) {
            const last = getLastTextNode(node);
            if (last) return last
        }
    }
    return null
}

const updateCursor = async () => {
    await nextTick()  // 确保DOM已经渲染完成
    const contentDom = contentRef.value
    const lastText = getLastTextNode(contentDom)
    const textNode = document.createTextNode('\u200b') // 插入临时文本节点，用于计算光标位置

    if (lastText) {
        lastText.parentElement.appendChild(textNode)
    } else {
        contentDom.appendChild(textNode)
    }

    const domRect = contentDom.getBoundingClientRect()  // 获取容器的位置信息
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.setEnd(textNode, 0)

    const rect = range.getBoundingClientRect()  // 使用range计算文本节点位置
    pos.x = rect.left - domRect.left
    pos.y = rect.top - domRect.top

    // 获取当前行的 `font-size`
    const computedStyle = window.getComputedStyle(textNode.parentElement);
    const fontSize = computedStyle.getPropertyValue('font-size');
    cursorHeight.value = parseInt(fontSize, 10);  // 更新光标的高度

    textNode.remove()  // 删除临时文本节点
}

// 每次更新后重新计算光标位置
onUpdated(updateCursor)

// 配置marked库的选项，设置代码高亮
marked.setOptions({
    highlight: function (code, lang) {
        // 如果提供了语言并且highlight.js支持该语言，执行代码高亮
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value
        }
        // 否则，自动检测语言并高亮
        return hljs.highlightAuto(code).value
    },
})

// 计算属性，返回解析后的markdown内容
const markdownContent = computed(() => {
    return marked.parse(props.content) // 使用marked库解析props传入的markdown内容
})
</script>

<style scoped>
.markdown-body {
    background: inherit;
    /* 继承父元素背景 */
    line-height: 2;
    /* 行高设置为2 */
    font-family: 'Roboto Mono';
    /* 使用等宽字体 */
    color: black;
}

.container {
    position: relative;
    /* 容器使用相对定位 */
}

.cursor {
    /* 光标样式设置 */
    position: absolute;
    /* 绝对定位 */
    width: 10px;
    /* 宽度10px */
    background: grey;
    /* 红色背景 */
    animation: toggle 0.6s infinite;
    /* 0.6秒的闪烁动画 */
    opacity: 0;
    /* 初始透明度为0 */
    left: calc(v-bind('pos.x') * 1px);
    /* 光标的水平位置，使用pos.x值 */
    top: calc(v-bind('pos.y') * 1px);
    /* 光标的垂直位置，使用pos.y值 */
    height: calc(v-bind('cursorHeight') * 1px);;
    /* 光标的高度动态绑定 */
}

@keyframes toggle {

    /* 光标闪烁动画 */
    30% {
        opacity: 1;
        /* 30%的时间段显示光标 */
    }
}
</style>


<!-- getBoundingClientRect() 返回一个矩形对象，这个对象包含元素的尺寸及其相对于视口的位置信息。该方法常用于获取元素在页面中的精确位置，比如用来实现拖放、计算光标位置、元素对齐等操作。
属性：
getBoundingClientRect() 返回的 DOMRect 对象有以下属性：

left：元素左边框距离视口左边的距离。
top：元素上边框距离视口顶部的距离。
right：元素右边框距离视口左边的距离。
bottom：元素下边框距离视口顶部的距离。
width：元素的宽度。
height：元素的高度。
x：元素左边框相对于视口左边的水平距离，等同于 left。
y：元素上边框相对于视口顶部的垂直距离，等同于 top。 -->
