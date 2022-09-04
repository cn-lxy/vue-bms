<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    guides: Array,
    uid: Number
})
</script>

<template>
    <div class="card" v-for="guide in guides">
        <RouterLink :to="{name: guide.urlName, query: guide.query, params: { uid: uid }}">
            {{ guide.msg }}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ guide.num }}
                <span class="visually-hidden">unread messages</span>
            </span>
        </RouterLink>
    </div>
</template>

<style scoped>
@import '@/assets/css/init.css';

.card {
    /* flex布局按列排列 */
    position: relative;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #22212c;
    border: 1px solid #454158;
    border-radius: .5rem;
    margin-bottom: 1.5rem;
    padding: .5rem;
    max-height: 80vh !important;
}

.card img {
    border-radius: 50%;
    vertical-align: middle;
    padding: 10px;
}
</style>