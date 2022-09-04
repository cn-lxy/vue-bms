<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const admin = ref({
    account: '',
    password: '',
})

const login = () => {
    console.log(admin.value)
    let url = '/api/admin/login'
    let params = {
        account: admin.value.account,
        password: admin.value.password,
    }
    axios.post(url, params, { headers: { 'ContentType': 'application/json' } })
        .then(res => {
            console.log(res.data)
            if (res.data.code === 1) {
                // TAG
                console.log('admin login success')
                alert('登录成功!')
                router.push({ name: 'adminHome' })
            }
        })
        .catch(err => {
            console.log(err)
        })
}
</script>

<template>
    <div class="box">
        <div class="card-login">
            <div class="login-title">
                <span class="icon">
                    <img src="@/assets/svg/admin.svg">
                </span>
                <span style="display: inline-block;padding-top: 4px;">
                    管理员登录
                </span>
            </div>
            <div>
                <div class="mb-3">
                    <label for="admin" class="form-label">Admin account</label>
                    <input type="text" name="admin" class="form-control" id="admin" aria-describedby="emailHelp"
                        v-model="admin.account">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" id="password" v-model="admin.password">
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button class="btn btn-primary" @click="login">Submit</button>
            </div>
        </div>
    </div>
</template>

<style>
@import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/init.css';

.box {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
}

.card-login {
    width: 150%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    border-left: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
}

.login-title {
    padding-left: 5px;
    padding-right: 5px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15px;
}

.icon {
    vertical-align: middle;
}

.form-input {
    display: flex;
    flex-direction: column;
}

.form-input label {
    padding: 10px
}

.func {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
}

.func input {
    margin: 10px;
    background-color: #8aff80;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #161623;
}

body::before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(#f00, #f0f);
    clip-path: circle(30% at right 70%);
}

body::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(#2196f3, #e91e63);
    clip-path: circle(20% at 10% 10%);
}

input:active {
    background-color: skyblue;
}
</style>