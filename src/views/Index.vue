<template>
    <div class="main">
        <h3 class="title">Book Manager System</h3>
        <p class="emoji">🎉🎉🎉🎉</p>
        <p class="info">Welcome to vue-bms<span class="end">!</span></p>
        <div class="link">
            <RouterLink style="margin-left: -18px;" class="link-item" :to="userHomeUrl">👉 用户主页</RouterLink>
            <RouterLink class="link-item" :to="adminHomeUrl">👉 管理员主页</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const userHomeUrl = '/user/home'
const adminHomeUrl = '/admin/home'
</script>

<style scoped>
    .link {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-content: flex-start;
    }
    .link-item {
        font-size: 20px;
        margin-top: 20px;
    }
    .main {
        text-align: center;
    }
    .title {
        margin-top: 100px;
        font-size: 50px;
        color: hotpink;
    }
    .emoji {
        margin: 40px;
        font-weight: 400;
        font-size: 40px;
    }
    .info {
        margin: 40px;
        font-weight: 400;
        font-size: 20px;
        color: magenta;
    }
    .end {
        color: blueviolet;
        font-size: 35px;
        font-weight: 800;
        margin-left: 10px;
        vertical-align: middle;
    }
</style>