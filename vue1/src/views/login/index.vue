<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Welcome 请坐！</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" type="primary" round class="login_btn" size="default" @click="login" >登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User,Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import useUserStore from '../../store/modules/user';
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import { getTime } from '../../utils/time';

let useStore =useUserStore();
let loading = ref(false)
let $router =useRouter()
let loginForms=ref()

let loginForm = reactive({ username: 'admin', password: '111111' });
const login = async ()=>{
    console.log(loginForms.value.validate()+'3')
    await loginForms.value.validate()  
    loading.value=true;
    try{  
        // console.log(typeof((loginForm.password)))
        // console.log(loginForm.username)
        await useStore.userLogin(loginForm);    
        $router.push('/');
        ElNotification({
            type:'success',
            title:'欢迎回来',
            message:getTime()//`HI,${getTime()}`
        })
        loading.value=false
    }catch(error){
        loading.value=false
        ElNotification({
            type:'error',
            message:(error as Error).message+'登录失败'
        })
    }   
}
const validateUsername =(rule: any, value: any, callback: any)=>{
    if (value.length>=5){
        console.log('@'+rule)
        callback()
    }else{
        callback(new Error('账号长度至少五位'))
    }
}
const validatePassword =(rule: any, value: any, callback: any)=>{
    if (value.length>=5){
        console.log('@'+rule)
        callback()
    }else{
        callback(new Error('密码长度至少五位'))
    }
}
const rules ={
    username:[{ validator: validateUsername, trigger: 'blur'}],
    password:[{ validator: validatePassword, trigger: 'change'}],
}
</script>

<style scoped>
.login_container {
    width: 100%;
    height: 100vh;
    background: url('/src/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login_form {
        position: relative;
        width: 60%;
        top: 30vh;
        background: url('/src/assets/images/login_form.png');
        background-size: cover;
        padding: 40px;
        h1 {
            color: white;
            font-size: 40px;
        }
        h2 {
            color: white;
            font-size: 30px;
            margin:20px 0px;
        }
        .login_btn {
            width: 100%;
        }       
    }
}
</style>