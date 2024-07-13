<template>
    <div class="box">
        <div class="title">
            <span>男女比例</span>
        </div>
        <div class="img">
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class='people'>
            <div class="man">
                <p>男士</p>
                <img src="../../images/man.png" alt="">
            </div>
            <div class="woman">
                <p>女士</p>
                <img src="../../images/woman.png" alt="">
            </div>
        </div>
        <div class="rate">
            <p class="m">男士58%</p>
            <p class="w">女士42%</p>
        </div>
        <div class="chart" ref='chart'></div>

    </div>

</template>

<script setup name="Age">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
//获取图形图标的DOM节点
let chart = ref();
onMounted(() => {
    //初始化echarts实例
    let mycharts = echarts.init(chart.value);
    //设置配置项
    mycharts.setOption({
        //组件标题
        title: {
            text: '男女比例',//主标题
            textStyle: {//主标题颜色
                color: 'skyblue'
            },
            left: '40%'
        },
        //x|y
        xAxis: {
            show: false,
            min: 0,
            max: 100
        },
        yAxis: {
            show: false,
            type: 'category'
        },
        series: [
            {
                type: 'bar',
                data: [58],
                barWidth: 20,
                z: 100,
                itemStyle: {
                    color: 'skyblue',
                    borderRadius: 20
                }
            }
            ,
            {
                type: 'bar',
                data: [100],
                barWidth: 20,
                //调整女士柱条位置
                barGap: '-100%',
                itemStyle: {
                    color: 'pink',
                    borderRadius: 20
                }
            }
        ],
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    });
})

</script>

<style scoped lang="scss">
.box {
    // width: 100%;
    // height: 100%;
    background: url('../../images/dataScreen-main-cb.png') no-repeat;
    background-size: cover;
    margin-top: 10px;

    .title {
        height: 50px;
        color: white;
        margin: 15px
    }

    .img {
        position: fixed;
        left: 15px;
        top: 470px;
    }

    .people {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-evenly;

        .man {
            margin: 20px;
            width: 111px;
            height: 115px;
            background: url('../../images/man-bg.png') no-repeat;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;

            p {
                position: fixed;
                top: 540px;
                color: white;
            }
        }

        .woman {
            margin: 20px;
            width: 111px;
            height: 115px;
            background: url('../../images/woman-bg.png') no-repeat;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;

            p {
                position: fixed;
                top: 540px;
                color: white;
            }
        }
    }

    .rate {
        display: flex;
        justify-content: space-between;
        color: white;
        height: 90px;

        .m {
            position: fixed;
            top: 660px;
            left: 100px
        }

        .w {
            position: fixed;
            top: 660px;
            left: 310px
        }
    }
    .chart {
        height: 70px;
    }

}
</style>
s