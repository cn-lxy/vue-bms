<template>
    <div class="main">
        <h3 class="title">测试页面1</h3>
        <p>Count: {{ store.count }}</p>
        <div><button @click="clickIncrease">+</button></div>
        <div><button @click="clickDecrease">-</button></div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '../stores/counter'
import { onBeforeMount } from 'vue';

const store = useCounterStore()
const { name, double } = storeToRefs(store)
const a = 2

const clickIncrease = () => {
    store.increment()
    console.log(store.count)
}

const clickDecrease = () => {
    store.count--
    console.log(store.count)
}

onBeforeMount(() => {
    console.log(name)
    console.log(`count: ${store.count}`)
})
</script>
