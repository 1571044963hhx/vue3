<template>
    <div class="box">
        <div class="top">
            <span>实时游客统计</span>
            <p>可预约总人数 <span>999999</span> 人</p>
        </div>
        <div class="img">
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="center">
            <span class="sum" v-for="item in people">{{ item }}</span>
        </div>
        <div class="bottom" ref="charts"></div>

    </div>
</template>

<script setup name="Tourist">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill';
let people = ref('216908人');
let charts = ref();

onMounted(() => {
    //获取echarts类的实例
    let mycharts = echarts.init(charts.value);
    //设置实例的配置项
    mycharts.setOption({
        //标题组件
        // title: {
        //     text: '水球图'
        // },
        // //x|y轴组件
        // xAxis: {},
        // yAxis: {},
        //系列:决定你展示什么样的图形图标
        series: {
            type: 'liquidFill',//系列
            data: [0.6, 0.4, 0.2],//展示的数据
            waveAnimation: true,//动画
            animationDuration: 3,
            animationDurationUpdate: 0,
            radius: '80%',//半径
            outline: {//外层边框颜色设置
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'skyblue',
                    borderColor: '#294D99',
                    borderWidth: 8,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                }
            },
        },
        //布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    })
})
</script>

<style scoped lang="scss">
.box {
    .top {
        height: 40px;
        color: white;
        margin: 15px;

        p {
            position: fixed;
            top: 70px;
            left: 300px
        }

        span {
            font-size: 15px;
            line-height: 15px;
        }
    }

    .img {
        position: fixed;
        top: 72px;
        margin-left: 15px;
    }

    .center {
        font-size: 45px;
        color: #0df5d6;
        margin: 10px;
        display: flex;
        text-align: center;

        .sum {
            width: 100%;
            background: url('../../images/total.png');
            margin-left: 3px;
        }
    }

    .bottom {
        width: 100%;
        height: 260px;
    }
}
</style>
