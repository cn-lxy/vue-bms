<template>
    <header>
        <div class="navbar">
            <div class="navbar-container">
                <RouterLink :to="titleLink">
                    <span class="nav-logo"></span>
                    <span class="nav-info">{{ title }}</span>
                </RouterLink>
                <span v-if="msg">
                    {{ msg }}
                    <RouterLink :to="url" style="color:#7d8bd0;">{{ name }}</RouterLink>
                </span>
            </div>
        </div>
    </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
    title: String,
    msg: String,
    name: String,
    url: { type: String, default: "/" },
    titleLink: { type: String, default: "/" },
})
</script>

<style scoped>
@import '@/assets/css/init.css';

.navbar {
    position: relative;
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    background-color: #22212c;
    border-color: #22212c;
    height: 8vh;
    padding: 10px 10px;
    z-index: 1;
}

.navbar-container {
    height: 100%;
    max-width: 1140px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding-left: 12px;
    padding-right: 12px;
    margin-left: auto;
    margin-right: auto;
}

.nav-logo {
    display: inline-block;
    background-image: url("../assets/img/library.png");
    background-size: 32px 32px;
    background-position: 0 0;
    background-repeat: no-repeat;
    height: 32px;
    width: 32px;
    border: 0;
    border-radius: 100%;
    vertical-align: middle;
    margin-right: 10px;
}

.navbar-container a {
    color: #f2f2f2;
}

a:hover {
    color: #937efc;
}
</style>