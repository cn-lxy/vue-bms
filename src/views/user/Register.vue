<template>
    <Header :title="title"/>
    <RegisterCard/>
</template>

<script setup>
    import RegisterCard from '@/components/RegisterCard.vue'
    import Header from '@/components/Header.vue'
</script>

<script>
    export default {
        name: "RegisterView",
        data() {
            return {
                title: "用户注册"
            }
        }
    }
</script>

<style scoped>

</style>