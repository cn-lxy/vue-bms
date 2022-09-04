<template>
    <div class="card">
        <div style="margin-left: 0; margin-bottom: 5px">搜索</div>
        <div class="input-group input-group-sm">
            <input type="text" class="form-control" placeholder="name or isbn" id="search-field" v-model="searchKey">
            <button class="btn btn-outline-secondary" type="button" id="search-btn" @click="search">Search</button>
        </div>
        <div class="search-type">
            <div class="form-check form-switch">
                <input class="form-check-input" type="radio" id="by-name" value="name"
                    v-model="checked">
                <label class="form-check-label" for="by-name">
                    by name
                </label>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="radio" id="by-isbn" value="isbn"
                    v-model="checked">
                <label class="form-check-label" for="by-isbn">
                    by isbn
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

defineProps({
    number: Number
})
const emit = defineEmits(['dataTransfer'])

const searchKey = ref('')
const checked = ref('name')

const search = () => {
    if (searchKey.value === '') {
        return
    }
    let by =  checked.value === 'isbn' ? 0 : (checked.value === 'name' ? 1 : -1)
    let value = searchKey.value
    // 清除 url 查询参数
    let query = JSON.parse(JSON.stringify(route.query))
    delete query.type
    router.push({path: route.fullPath, query: query})
    emit('dataTransfer', {by, value})
}
</script>

<style scoped>
@import '@/assets/css/bootstrap.min.css';
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
    justify-content: flex-start;
    flex-direction: column;
}

.form-switch {
    padding-left: 0;
}

.form-check-input {
    margin-left: -60px !important;
    transition: background-position .15s cubic-bezier(.68, -0.55, .27, 1.55) !important;
}

.form-check-label {
    margin-left: -20px;
}

.form-check-input:checked {
    background-color: #7d8bd0 !important;
    border-color: #7d8bd0 !important;
}

.search-type {
    margin: 5px 5px;
}

.btn-outline-secondary:hover {
    color: #fff;
    background-color: #15e352;
    border-color: #15e352;
}

.btn {
    color: #f2f2f2;
    background-color: #7d8bd0;
}
</style>