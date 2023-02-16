<template>
    <h3>测试页面2</h3>
</template>

<script seup>
import { onBeforeMount } from 'vue';

const msg = 'Hello World'

onBeforeMount(() => {
    console.log(msg)
})
</script>