<template>
    <Header v-bind="data.header" />
    <div class="main-container">
        <div class="row">
            <div class="col item-1">
                <div class="card"><a href="/admin/manage/book">图书管理</a></div>
                <div class="card"><a href="/admin/manage/user">用户管理</a></div>
            </div>
            <div class="col item-2">
                <div class="card">
                    <table class="table" width="60%">
                        <thead>
                            <tr>
                                <th scope="col" v-for="title in data.table.title">{{ title }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(rowData, index) in data.table.rowData" :key="index">
                                <th scope="row">{{ index + 1 + (data.table.page.page - 1) * 10 }}</th>
                                <td v-for="data in rowData.data"> {{ data }}</td>
                                <td v-if="!rowData.back">
                                    <a href="javascript:void(0)" @click="completedBorrowEvent(rowData.id)">完成借阅</a>
                                </td>
                                <td v-else></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="page-change" v-if="data.table.rowData">
                    <button id="upPage" @click="tableMethod.upPage">上一页</button>
                    <button id="downPage" @click="tableMethod.downPage">下一页</button>
                </div>
            </div>
            <div class="col item-3">
                <div class="card">
                    <div style="margin-left: 0; margin-bottom: 5px">搜索</div>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" placeholder="search" v-model.trim="data.search.key">
                        <button class="btn btn-outline-secondary" type="button" @click="searchEvent">Search</button>
                    </div>
                    <div class="search-type">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="radio" name="search" id="s-default" value="default" v-model="data.search.checked">
                            <label class="form-check-label" for="s-default">
                                默认&nbsp;&nbsp;
                            </label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="radio" name="search" id="s-uname" value="userName" v-model="data.search.checked">
                            <label class="form-check-label" for="s-uname">姓名&nbsp;&nbsp;</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="radio" name="search" id="s-bname" value="bookName" v-model="data.search.checked">
                            <label class="form-check-label" for="s-bname">书名&nbsp;&nbsp;</label>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div style="margin-left: 0; margin-bottom: 5px">过滤</div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="radio" name="filter" id="f-all" value="all"
                            v-model="data.filter.type">
                        <label class="form-check-label" for="f-borrow">
                            全部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </label>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="radio" name="filter" id="f-borrow" value="borrow"
                            v-model="data.filter.type">
                        <label class="form-check-label" for="f-borrow">
                            未归还&nbsp;&nbsp;
                        </label>
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="radio" name="filter" id="f-back" value="back"
                            v-model="data.filter.type">
                        <label class="form-check-label" for="f-back">
                            已归还&nbsp;&nbsp;
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import Table from '@/components/Table.vue'
import AdminIcon from '@/assets/img/admin.png'
import { ref, onBeforeMount, watch } from 'vue'
import axios from 'axios'

// 页面标题
const title = '借阅管理'

const req = ref({
    url: {
        userUrl: '/api/admin/manager/borrow/user',
        bookUrl: '/api/admin/manager/borrow/book', 
    },
    search: {
        url: '',
        params: {
            type: 0,  //  {"1":"全部借阅", "2":"未还借阅", "3":"已还借阅"}
            name: '',  // user name / book name
        },
    },
    default: {
        url: '/api/admin/manager/borrow',
        params: {
            type: 1,
        }
    }
})

// 全局数据
const data = ref({
    header: {
        title: title,
        titleLink: '/admin/manage/borrow',
        msg: '欢迎您!',
        name: 'admin',
    },
    table: {
        title: [
            '#', '借阅用户', '借阅书籍', '借阅天数', '借阅时间', '归还时间'
        ],
        rowData: [
            {
                id: -1,
                data: ['null', 'null', 'null', 'null', 'null'],
                back: false,
            },
        ],
        page: {
            url: req.value.default.url,
            page: 1,
            pageLen: 10,
            params: req.value.default.params
        },
    },
    search: {
        key: '',
        checked: 'default',
    },
    filter: {
        type: 'all',
    },
})

// table 方法
const tableMethod = {
    requestBooks: async function (url, params) {
        let bis = []
        await axios
            .get(
                url,
                { params: params },
                { header: { 'Content-Type': 'application/json' } }
            )
            .then(res => {
                console.log('request: ', res)
                bis = res.data.bis
            })
            .catch(err => {
                console.log(err)
            })
        return bis
    },
    parseData: function (data) {
        let tableRowData = []
        if (data === null) 
            return tableRowData
        data.forEach((e) => {
            tableRowData.push({
                id: e.id,
                data: [e.userName, e.bookName, e.days, e.borrowDate, e.backDate],
                back: e.backDate === 'NULL' ? false : true,
            })
        })
        return tableRowData
    },
    // page >= 1
    updatePage: function () {
        let page = data.value.table.page.page
        let limit = data.value.table.page.pageLen
        let offset = (page <= 1 ? 0 : page - 1) * 10
        let params = data.value.table.page.params
        params.offset = offset
        params.limit = limit
        let books = this.requestBooks(
            data.value.table.page.url,
            params
        )
        books.then(res => {
            console.log(res)
            data.value.table.rowData = this.parseData(res)
        })
    },
    upPage: function () {
        if (data.value.table.page.page > 1) {
            data.value.table.page.page--
            tableMethod.updatePage()
        }
    },
    downPage: function () {
        if (data.value.table.rowData.length >= data.value.table.page.pageLen) {
            data.value.table.page.page++
            tableMethod.updatePage()
        }
    },
}

// 完成借阅点击事件
const completedBorrowEvent = (bid) => {
    let flag = confirm('确认完成借阅?')
    if (!flag)
        return
    let url = `/api/admin/manager/borrow/back?bid=${bid}`
    axios.get(url)
        .then(res => {
            console.log(res.data)
            if (res.data.code === 1) {
                alert('成功')
                tableMethod.updatePage()
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// 搜索点击事件
const searchEvent = () => {
    switch (data.value.filter.type) {
        case 'all':
            req.value.search.params.type = 1
            req.value.default.params.type = 1
            break
        case 'borrow':
            req.value.search.params.type = 2
            req.value.default.params.type = 2
            break
        case 'back':
            req.value.search.params.type = 3
            req.value.default.params.type = 3
            break
    }
    if (data.value.search.checked === 'default') {
        data.value.table.page.url = req.value.default.url
        data.value.table.page.params = req.value.default.params
        tableMethod.updatePage()
    } else {
        if (data.value.search.key === '')
            return
        switch (data.value.search.checked) {
            case 'default':
                return
            case 'userName':
                req.value.search.url = req.value.url.userUrl
                break
            case 'bookName':
                req.value.search.url = req.value.url.bookUrl
                break
        }
        req.value.search.params.name = data.value.search.key
        data.value.table.page.url = req.value.search.url
        data.value.table.page.params = req.value.search.params
        tableMethod.updatePage()
    }
}

watch(data.value.filter, () => {
    switch (data.value.filter.type) {
        case 'all':
            req.value.search.params.type = 1
            req.value.default.params.type = 1
            break
        case 'borrow':
            req.value.search.params.type = 2
            req.value.default.params.type = 2
            break
        case 'back':
            req.value.search.params.type = 3
            req.value.default.params.type = 3
            break
    }
    tableMethod.updatePage()
    
}, {
    deep: true
})

onBeforeMount(() => {
    // 修改图标和标题
    document.getElementsByTagName('title')[0].innerText = title
    document.getElementsByTagName('link')[0].href = AdminIcon
    tableMethod.updatePage()
})
</script>

<style>
@import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/init.css';

.main-container {
    height: 100vh;
    padding-top: 1.5rem !important;
    /* max-width: 1140px; */
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
    margin: auto;
}

.row {
    display: flex;
    flex-direction: row;
    padding-left: -12px;
    padding-right: -12px;
    flex-wrap: wrap;
    width: 100%;
}

.col {
    position: relative;
    /* flex: 2 1 auto; */
    padding-left: 12px;
    padding-right: 12px;
    flex-basis: 0;
}

.item-1 {
    flex-grow: 1;
}

.item-2 {
    flex-grow: 5;
}

.item-3 {
    flex-grow: 1;
}

td>a {
    color: #7d8bd0;
}

td>a:hover {
    color: #13f15d !important;
}

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