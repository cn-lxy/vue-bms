<template>
    <RouterView v-slot="{Component}">
        <Transition name="fade">
            <component :is="Component" mode="out-in"/>
        </Transition>
    </RouterView>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
@import '@/assets/css/init.css';

.fade-enter-active {
    transition: all 0.3s ease-out;
}

.fade-leave-active {
    transition: opacity 0.5s ease;
    /* transition: all 0.5s cubic-bezier(.17,.67,1,.46); */
}

.fade-enter-from,
.fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>
