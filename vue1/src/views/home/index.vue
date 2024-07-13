<template>
    <el-card style="margin: 30px;">
        <div class="box">
            <img :src="usestore.avatar" class="avatar">
            <div class="bottom">
                <h3 class="title">{{ getTime() }} {{ usestore.username }}</h3>
                <p class="subtitle">硅谷甄选运营平台</p>
            </div>
        </div>
    </el-card>  
    <div class="bottoms">
        <img src="../../assets/icons/welcome.svg" alt="" width="800px">
    </div>
</template>

<script setup lang="ts">
import useUserStore from '../../store/modules/user';
import { getTime } from '../../utils/time'
let usestore = useUserStore();


</script>

<style scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 25px;
      font-weight: 900;
      margin-bottom: 20px;
    }

    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bottoms{
    position:fixed;
    left: 600px;
    top: 350px;
}
</style>