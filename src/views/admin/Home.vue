<template>
    <div class="container">
        <div class="card">
            <div class="content">
                <h2>01</h2>
                <h3>图书管理</h3>
                <p></p>
                <a href="/admin/manage/book">管理</a>
            </div>
        </div>
        <div class="card">
            <div class="content">
                <h2>02</h2>
                <h3>借阅管理</h3>
                <p></p>
                <a href="/admin/manage/borrow">管理</a>
            </div>
        </div>
        <div class="card">
            <div class="content">
                <h2>03</h2>
                <h3>用户管理</h3>
                <p></p>
                <a href="/admin/manage/user">管理</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';

import AdminHomeIcon from '@/assets/img/admin.png'

const title = '管理员-导航'

onBeforeMount(() => {
    // 更新标题和图标
    document.getElementsByTagName('title')[0].innerText = title
    document.getElementsByTagName('link')[0].href = AdminHomeIcon

})
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
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

.container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    flex-wrap: wrap;
    z-index: 1;
}

.container .card {
    position: relative;
    width: 280px;
    height: 400px;
    margin: 30px;
    box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    border-left: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
}

.container .card .content {
    padding: 20px;
    text-align: center;
    transform: translateY(100px);
    opacity: 1;
    /*更改不透明度为1，原来为0*/
    transition: 0.5s;
}

.container .card .content h2 {
    position: absolute;
    top: -200px;
    right: 30px;
    font-size: 8em;
    color: rgba(255, 255, 255, 0.05);
    pointer-events: none;
}

.container .card .content h3 {
    font-size: 1.8em;
    color: #fff;
    z-index: 1;
    position: relative;
    top: -100px;
}

.container .card .content p {
    font-size: 1em;
    color: #fff;
    font-weight: 300;

}

.container .card .content a {
    position: relative;
    display: inline-block;
    padding: 8px 20px;
    margin-top: 15px;
    background: #fff;
    color: #000;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 500;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

a:hover {
    background-color: #5974ca !important;
    transition: .5s;
}

.card:hover h2 {
    color: #7a78c4 !important;
    transition: 0.8s;
}
</style>