<template>
    <div class="card">
        <table class="table" width="60%">
            <thead>
                <tr>
                    <th scope="col" v-for="title in table.title">{{ title }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rowData, index) in table.rowData" :key="index">
                    <th scope="row">{{ index + 1 + (table.page.page - 1) * 10 }}</th>
                    <td v-for="data in rowData.data"> {{ data }}</td>
                    <td>
                        <a 
                            v-if="rowData.yes" 
                            href="javascript:;"
                            @click="emit('link', rowData.id)"
                        >
                            {{ table.link.title }}
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="page-change" v-if="table.rowData">
        <button id="upPage" @click="emit('upPage')">上一页</button>
        <button id="downPage" @click="emit('downPage')">下一页</button>
    </div>
</template>

<script setup>
const props = defineProps({
    table: {
        type: Object,
    }
})

const emit = defineEmits(['upPage', 'downPage', 'link'])
</script>

<style scoped>
.card {
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
    /* min-height: 80vh !important; */
    justify-content: flex-start;
    flex-direction: column;
}

table * {
    color: #f2f2f2;
}

table th:hover {
    color: #f1c313 !important;
}

td>a {
    color: #7d8bd0;
}

td>a:hover {
    color: #13f15d !important;
}

.page-change {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.page-change>button {
    margin-right: 10px;
    margin-left: 10px;
    background-color: #22212c;
    border: 2px solid #2c2536;
    color: #7d8bd0;
    border-radius: 8px;
}

.page-change>button:hover {
    background-color: #7d8bd0;
    color: #f2f2f2;
}
</style>