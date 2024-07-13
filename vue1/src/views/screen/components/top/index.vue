<template>
    <div class="top">
        <div class="left">
            <span class="lbtn" @click="goHome">首页</span>
        </div>
        <div class="center">
            <div class="title">智慧旅游可视化数据大平台</div>
        </div>
        <div class="right">
            <span class="rbtn">统计报告</span>
            <span class="time">{{time}}</span>
        </div>
    </div>

</template>

<script setup name="Top">
//@ts-ignore
import moment from 'moment';
import {useRouter} from 'vue-router';
import {ref,onMounted,onBeforeUnmount} from 'vue'
let $router = useRouter();
const goHome=()=>{
    $router.push('/home')
}

let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'));
let timer = ref(0)
onMounted(()=>{
    setInterval(() => {
        time.value=moment().format('YYYY年MM月DD日 hh:mm:ss')
    }, 1000);
})
onBeforeUnmount(()=>{
    clearInterval(timer.value)
})

</script>

<style scoped lang="scss">
.top{
    width:100%;
    height: 40px;
    display: flex;
    .left{
        flex:1.5;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;
        .lbtn{
            width:150px;
            height: 40px;
            float:right;
            background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
            background-size: cover;
            text-align: center;
            line-height: 40px;
            color: aqua;
            font-size: 20px;
            cursor: pointer;
        }
    }
    .right{
        flex:1.5;
        background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
        background-size: cover;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rbtn{
            width: 150px;
            height: 40px;
            background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
            background-size: cover;
            text-align: center;
            line-height: 40px;
            color: aqua;
            font-size: 20px;
        }
        .time{
            color: aqua;
            font-size: 20px;
        }
    }
    .center{
        flex:2;
        .title{
            width: 100%;
            height: 74px;
            background: url(../../images/dataScreen-header-center-bg.png);
            background-size: cover;
            text-align: center;
            line-height: 74px;
            color: aqua;
            font-size: 30px;
        }
    }
}
</style>
