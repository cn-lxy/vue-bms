<template>
    <Header v-bind="data.header" />
    <div class="main-container">
        <div class="row">
            <div class="col item-1">
                <div class="card"><a href="../borrow/index.jsp?id=${admin.getId()}">借阅管理</a></div>
                <div class="card"><a href="../user/index.jsp?id=${admin.getId()}">用户管理</a></div>
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
                                <td>
                                    <a href="/admin/manage/book/modify">修改</a>
                                    <router-link 
                                        :to="{ name: 'ModifyBook', query: {id: rowData.id}}"
                                    />
                                </td>
                                <td>
                                    <a href="">删除</a>
                                </td>
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
                <div class="card"><a href="/admin/manage/book/add">添加图书</a></div>
                <SearchBar @dataTransfer="dataTransfer"/>
                <BookSort :types="data.bookSort" @sortEvent="sortEvent" />
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import Table from '@/components/Table.vue'
import BookSort from '@/components/BookSort.vue'
import AdminIcon from '@/assets/img/admin.png'

import { ref, onBeforeMount, watch } from 'vue'
import axios from 'axios'
import SearchBar from '../../components/SearchBar.vue'


// 页面标题
const title = '图书管理'

const req = ref({
    search: {
        url: '/api/admin/manager/book/search',
        params: {
            by: '',
            value: ''
        }
    },
    type: {
        url: '/api/admin/manager/books',
        params: {
            by: 0,  // => 0: default, 1: get by type
            typeid: -1
        }
    }
})

// 全局数据
const data = ref({
    header: {
        title: '图书管理',
        msg: '欢迎您!',
        name: 'admin',
    },
    table: {
        title: [
            '#', '书名', '书类', '作者', '出版社', '出版时间', '库存'
        ],
        rowData: [
            {
                id: '-1',
                data: ['book1', '小说', '作者1', '出版社1', '2019-1', 100]
            },
        ],
        link: { title: '借阅', url: '/api/user/borrow' },
        page: {
            url: req.value.type.url,
            page: 1,
            pageLen: 10,
            params: req.value.type.params
        },
    },
    bookSort: [
        [{ id: 1, name: '小说' }, { id: 2, name: '历史' }, { id: 3, name: '科技' }],
        [{ id: 4, name: '哲学' }, { id: 5, name: '经济' }, { id: 6, name: '工程技术' }],
        [{ id: 7, name: '心理' }, { id: 8, name: '互联网' }, { id: 9, name: '自然科学' }],
    ],
})

// table 方法
const tableMethod = {
    requestBooks: async function (url, params) {
        let books = []
        await axios
            .get(
                url,
                { params: params },
                { header: { 'Content-Type': 'application/json' } }
            )
            .then(res => {
                books = res.data.books
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
        return books
    },
    parseData: function (data) {
        data.map((item) => {
            switch (item.type_id) {
                case 1:
                    item.type = '小说'
                    break
                case 2:
                    item.type = '历史'
                    break
                case 3:
                    item.type = '政治'
                    break
                case 4:
                    item.type = '哲学'
                    break
                case 5:
                    item.type = '经济'
                    break
                case 6:
                    item.type = '工程技术'
                    break
                case 7:
                    item.type = '心理'
                    break
                case 8:
                    item.type = '互联网'
                    break
                case 9:
                    item.type = '自然科学'
                    break
                default:
                    item.type = '未知'
                    break
            }
        })
        let tableRowData = []
        data.forEach((e) => {
            tableRowData.push({
                id: e.isbn,
                yes: e.stock > 0 ? true : false,
                data: [e.name, e.type, e.author, e.public, e.public_date, e.stock]
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
    link: function (isbn) {
        // 输入借阅天数
        let days = prompt('请输入借阅天数', 10)
        let url = data.value.table.link.url
        let params = {
            userId: data.value.user.id, // user id 
            bookIsbn: isbn,             // book isbn
            days: days * 1              // borrow days
        }
        axios.post(url, params)
            .then(res => {
                if (res.data.code === 1) {
                    alert('借阅成功')
                    // 借阅成功后 刷新 借阅条目&库存
                    borrowNum.allBorrow()
                    borrowNum.borrowing()
                    borrowNum.borrowed()
                    tableMethod.updatePage()
                } else {
                    alert('借阅失败')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}

// 点击搜索事件
const dataTransfer = ({by, value}) => {
    req.value.search.params = { by: by, value: value }
    data.value.table.page.url = req.value.search.url
    data.value.table.page.params = req.value.search.params
}

// 书籍分类点击事件
const sortEvent = (typeId) => {
    req.value.type.params = { by: 1, typeid: typeId }
    data.value.table.page.url = req.value.type.url
    data.value.table.page.params = req.value.type.params
}

watch(data.value.table.page, (newVal, val) => {
    tableMethod.updatePage()
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