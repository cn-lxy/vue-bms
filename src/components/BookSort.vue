<template>
    <div class="card-types">
        <div>书籍分类</div>
        <div class="book-types" v-for="items in types">
            <a v-for="type in items" href="javascript:;" @click="emit('sortEvent', type.id)">#{{ type.name }}</a>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['sortEvent'])
defineProps({
    types: {
        type: Array,
        default: []
    }
})
</script>

<style>
.card-types {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    /*flex: 1;*/
    background-color: #22212c;
    border: 1px solid #454158;
    border-radius: .5rem;
    margin-bottom: 1.5rem;
    padding: .5rem;
    max-height: 80vh !important;
}

.book-types {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1 1 auto;
}
</style>
