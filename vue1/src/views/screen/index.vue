<template>
    <div class="containter">
        <div class="screen" ref="screen">
            <div class="top">
                <Top />
            </div>
            <div class="bottom">
                <div class="left">
                    <Tourist class="tourist"></Tourist>
                    <Age class="age"></Age>
                    <Sex class="sex"></Sex>
                </div>
                <div class="center">
                    <Map class="map"></Map>
                    <Line class="line"></Line>
                </div>
                <div class="right">
                    <Rank class="rank"></Rank>
                    <Year class="year"></Year>
                    <Counter class="count"></Counter>
                </div>
            </div>
        </div>
    </div>


</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Top from './components/top/index.vue';
import Tourist from './components/tourist/index.vue';
import Age from './components/age/index.vue';
import Sex from './components/sex/index.vue';

import Map from './components/map/index.vue'
import Line from './components/line/index.vue'


import Rank from './components/rank/index.vue';
import Year from './components/year/index.vue';
import Counter from './components/couter/index.vue'

let screen = ref();
onMounted(() => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

function getScale(w = 1920, h = 1080) {
    const ww = window.innerWidth / w;
    const wh = window.innerHeight / h;
    return ww < wh ? ww : wh
}

window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style lang="scss" scoped>
.containter {
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat;
    background-size: cover;

    .screen {
        position: fixed;
        width: 1920px;
        height: 1080px;
        left: 50%;
        top: 50%;
        transform-origin: left top;

        .top {
            width: 100%;
            height: 40px;
        }

        .bottom {
            display: flex;

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                .rank {
                    flex: 1.2;
                }

                .year {
                    flex: 1;

                }

                .count {
                    flex: 1;
                }
            }

            .center {
                flex: 2;
                display: flex;
                height: 1040px;
                flex-direction: column;

                .map {
                    flex: 2.2;
                    color:azure
                }

                .line {
                    flex: 1;
                    color:azure

                }
            }

            .left {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 1040px;

                .tourist {
                    flex: 1.2;
                    background: url('./images/dataScreen-main-lt.png') no-repeat;
                    background-size: cover;
                }

                .age {
                    flex: 1;
                }

                .sex {
                    flex: 1;
                }
            }
            
        }
    }
}
</style>