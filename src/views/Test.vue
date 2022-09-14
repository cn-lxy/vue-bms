<template>
    <div class="app-container">
        <button class="button" @click="visible = true">打开弹窗</button>
        <Dialog v-model="visible">
            <img src="./assets/img.svg" alt="">
            <p>听说这个按钮很神奇！</p>
            <div><button class="button">一键三连</button></div>
            <div><button class="button text-button" @click="visible = false">关闭弹窗</button></div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from '../components/Dialog.vue'

const visible = ref(false)
</script>

<style lang="less" scoped>
// .app-container {
//     display: grid;
//     place-items: center;
// }

// .dialog-body {
//     img {
//         display: block;
//         width: 200px;
//         height: 200px;
//         margin: 0 auto;
//     }

//     img+p {
//         margin: 30px 0;
//         color: #6266f5;
//     }

//     .text-button {
//         margin-top: 15px;
//     }
// }
// button {
//     background-color: #282828;
//     color: #efeff2;
//     border-radius: 5px;
//     border: 0px;
//     padding: 10px;
// }
.app-container {
    background-color: #fff;
    width: 100%;
    height: 100vh;
}
</style>