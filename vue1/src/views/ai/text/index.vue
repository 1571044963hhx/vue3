<template>
    <div class="chat-container">
        <div class="chat-box">
            <div v-for="(msg, index) in chatMessages" :key="index" :class="['message', msg.send~er]">
                <template v-if="msg.type === 'text'">
                    <vue-markdown-it class="markdown-content" :source="msg.text"></vue-markdown-it>
                </template>
                <template v-else-if="msg.type === 'image'">
                    <img :src="msg.text" alt="Generated Image" class="generated-image" />
                </template>
            </div>
        </div>
        <div>
            <label>
                <input type="checkbox" v-model="isImageMode" /> 开启生成图片模式
            </label>
        </div>
        <div class="input-container">
            <input v-model="userInput" @keypress.enter="sendMessage" placeholder="请输入你的问题..." class="input-field" />
            <button @click="sendMessage" :disabled="isLoading" class="send-btn">发送</button>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import VueMarkdownIt from 'vue3-markdown-it';

const chatMessages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const isImageMode = ref(false);

const sendMessage = async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // 显示用户消息
    chatMessages.value.push({ sender: 'user-message', text: message, type: 'text' });
    userInput.value = '';
    isLoading.value = true;

    // 如果启用了生成图片模式
    if (isImageMode.value) {
        try {
            // 调用生成图片的 API
            const imageResponse = await fetch("https://api.mindcraft.com.cn/v1/images/generations", {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer MC-FDCE3F61527F49B09E0E13F64001E383',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "general_v2.1_L",
                    "prompt": message,      // 用于生成图片的提示语
                    "size": "512x512",       // 图片尺寸
                    "use_sr": true,          // 如果适用，使用高分辨率
                    "scale": 3.5,            // 图片缩放因子
                    "add_logo": true,        // 添加水印
                    "position": 1,           // 水印位置
                    "logo_text_content": "黄洪鑫"  // 水印文本
                })
            });

            const imageData = await imageResponse.json();
            if (imageData.data && imageData.data[0].file_url) {
                const imageUrl = imageData.data[0].file_url;
                // 将图片 URL 作为 text 存入消息数组
                chatMessages.value.push({ sender: 'bot-message', text: imageUrl, type: 'image' });
            } else {
                chatMessages.value.push({ sender: 'bot-message', text: '生成图片失败，请重试！', type: 'text' });
            }
        } catch (error) {
            console.error('Error:', error);
            chatMessages.value.push({ sender: 'bot-message', text: '❌ 获取图片失败，请稍后重试！', type: 'text' });
        }
    } else {
        // 默认情况下处理文本消息
        chatMessages.value.push({ sender: 'bot-message', text: '...', type: 'text' });

        try {
            const response = await fetch("https://api.mindcraft.com.cn/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer MC-FDCE3F61527F49B09E0E13F64001E383',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "GLM-4-Flash",
                    "messages": [{ "role": "user", "content": message }],
                    "temperature": 0.2,
                    "max_tokens": 2000,
                    "stream": true,
                    "web_search": false
                })
            });

            if (!response.body) throw new Error("Response body is empty");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botResponse = '';

            const readChunk = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    isLoading.value = false;
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });
                const jsonChunks = chunk.split("\n").filter(line => line.startsWith("data: "));
                jsonChunks.forEach(jsonStr => {
                    try {
                        const jsonData = JSON.parse(jsonStr.replace("data: ", "").trim());
                        if (jsonData.choices && jsonData.choices[0].delta) {
                            botResponse += jsonData.choices[0].delta.content || '';
                            chatMessages.value[chatMessages.value.length - 1].text = botResponse;
                        }
                    } catch (e) {
                        console.error("JSON parse error:", e, "Chunk:", jsonStr);
                    }
                });

                readChunk();
            };
            readChunk();
        } catch (error) {
            console.error("Error:", error);
            chatMessages.value[chatMessages.value.length - 1].text = "❌ 获取 AI 回复失败，请稍后重试！";
            isLoading.value = false;
        }
    }
};


</script>

<style scoped>
.chat-container {
    width: 100%;
    height: 100%;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: all 0.3s ease-in-out;
    border: 1px solid black;
}

.chat-box {
    height: 95%;
    overflow-y: auto;
    padding: 15px;
    border-radius: 10px;
    background: #f4f4f8;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.3s ease-in-out;


    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.generated-image {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
}


/* Webkit（Chrome, Edge, Safari）浏览器的滚动条优化 */
.chat-box::-webkit-scrollbar {
    width: 6px;
}

.chat-box::-webkit-scrollbar-track {
    background: transparent;
}

.chat-box::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.chat-box::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.4);
    /* 悬停时更明显 */
}

.message {
    padding: 12px 16px;
    border-radius: 20px;
    margin: 5px 0;
    max-width: 75%;
    word-wrap: break-word;
    animation: fadeIn 0.3s ease-in-out;
    line-height: 1.5;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.user-message {
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    align-self: flex-end;
}

.bot-message {
    background: #e9ecef;
    color: black;
    align-self: flex-start;
}

.input-container {
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease-in-out;

}

.input-field {
    flex: 1;
    padding: 12px;
    border: 2px solid #ccc;
    border-radius: 10px;
    transition: border 0.3s, box-shadow 0.3s;
    font-size: 16px;
    border: 1px solid black;
}

.input-field:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.send-btn {
    padding: 12px 16px;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s, transform 0.1s;
    font-size: 16px;
}

.send-btn:hover {
    background: #0056b3;
    transform: scale(1.05);
}

.send-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}
</style>