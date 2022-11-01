<template>
    <div>
        <Header v-bind="data.header" />
        <div class="main-container">
            <div class="row">
                <div class="col item-1">
                    <div class="card"><a href="/admin/manage/borrow">借阅管理</a></div>
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
                                    <!--<td><router-link :to="{ name: 'ModifyBook', params: { isbn: rowData.id }}">修改</router-link></td>-->
                                    <td><a href="javascript:void(0);" @click="modifyBookEvent(rowData.id)">修改</a></td>
                                    <td><a href="javascript:void(0)" @click="deleteBookEvent(rowData.id)">删除</a></td>
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
                    <!-- <div class="card"><a href="/admin/manage/book/add">添加图书</a></div> -->
                    <div class="card"><a href="javascript:void(0)" @click="addBookEvent">添加图书</a></div>
                    <SearchBar @dataTransfer="dataTransfer" />
                    <BookSort :types="data.bookSort" @sortEvent="sortEvent" />
                </div>
            </div>
        </div>
        <Dialog v-model="dialogVisible">
            <div class="add-book">
                <div class="modify-title">
                    <span class="title-icon"></span>
                    <span class="title-text">添加图书</span>
                </div>
                <form autocomplete="off" method="post" action="">
                    <div class="form-item">
                        <label for="isbn">ISBN</label>
                        <input type="text" id="isbn" name="isbn" maxlength="20" v-model="dialogData.form.isbn"
                            class="input-item">
                    </div>
                    <div class="form-item">
                        <label for="bookName">书名</label>
                        <input type="text" id="bookName" name="bookName" maxlength="20" class="input-item"
                            v-model="dialogData.form.name">
                    </div>
                    <div class="form-item">
                        <label for="author">作者</label>
                        <input type="text" id="author" name="author" maxlength="20" class="input-item"
                            v-model="dialogData.form.author">
                    </div>
                    <div class="form-item">
                        <label for="typeID">书籍类型</label>
                        <select class="form-select form-select-sm input-item" id="typeID" name="typeID"
                            v-model="dialogData.form.typeName">
                            <option v-for="type in dialogData.bookType">
                                {{ type.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-item">
                        <label for="press">出版社</label>
                        <input type="text" id="press" name="press" v-model="dialogData.form.public" class="input-item">
                    </div>
                    <div class="form-item">
                        <label for="pressDate">出版时间</label>
                        <el-date-picker v-model="dialogData.form.publicDate" value-format="YYYY-MM" type="month"
                            placeholder="Pick a month" class="input-item" />
                    </div>
                    <div class="form-item">
                        <label for="stock">库存</label>
                        <input type="number" id="stock" name="stock" min="0" v-model="dialogData.form.stock"
                            class="input-item">
                    </div>
                    <div class="form-item">
                        <div class="send-btn">
                            <input type="button" value="提交"
                                @click="dialogSend == 'add' ? sendFormOfAddBook() : sendFormOfModifyBook()">
                            <input type="reset" value="重置">
                        </div>
                    </div>
                </form>
            </div>
            <!-- <div><button class="button text-button" @click="dialogVisible = false">关闭弹窗</button></div> -->
        </Dialog>
        <Footer />
    </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import Table from '@/components/Table.vue'
import BookSort from '@/components/BookSort.vue'
import SearchBar from '@/components/SearchBar.vue'
import Dialog from '@/components/Dialog.vue'
import AdminIcon from '@/assets/img/admin.png'

import { ref, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'


// 页面标题
const title = '图书管理'
const dialogVisible = ref(false)
const dialogSend = ref('')  // add / modify

const router = useRouter()

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
        titleLink: '/admin/manage/book',
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
        [{ id: 1, name: '小说' }, { id: 2, name: '历史' }, { id: 3, name: '政治' }],
        [{ id: 4, name: '哲学' }, { id: 5, name: '经济' }, { id: 6, name: '工程技术' }],
        [{ id: 7, name: '心理' }, { id: 8, name: '互联网' }, { id: 9, name: '自然科学' }],
    ],
})

const dialogData = ref({
    bookType: [
        { id: 1, name: '小说' },
        { id: 2, name: '历史' },
        { id: 3, name: '科技' },
        { id: 4, name: '哲学' },
        { id: 5, name: '经济' },
        { id: 6, name: '工程技术' },
        { id: 7, name: '心理' },
        { id: 8, name: '互联网' },
        { id: 9, name: '自然科学' },
    ],
    typeSelect: '',
    form: {
        isbn: '',
        name: '',
        author: '',
        typeName: '',
        public: '',
        publicDate: '',
        stock: Number
    }
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
}

// 点击搜索事件
const dataTransfer = ({ by, value }) => {
    req.value.search.params = { by: by, value: value }
    data.value.table.page.url = req.value.search.url
    data.value.table.page.params = req.value.search.params
    tableMethod.updatePage()
}

// 书籍分类点击事件
const sortEvent = (typeId) => {
    req.value.type.params = { by: 1, typeid: typeId }
    data.value.table.page.url = req.value.type.url
    data.value.table.page.params = req.value.type.params
    tableMethod.updatePage()
}

// 删除书籍点击事件
const deleteBookEvent = (isbn) => {
    let delFlag = confirm('确认删除?')
    if (!delFlag)
        return
    let url = `/api/admin/manager/book/delete?isbn=${isbn}`
    axios.get(url)
        .then(res => {
            console.log(res.data)
            if (res.data.code === 1) {
                alert('删除成功')
                tableMethod.updatePage()
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// click: 添加书籍事件
const addBookEvent = () => {
    dialogSend.value = 'add'
    dialogVisible.value = true
}

// click: 修改书籍事件
const modifyBookEvent = (isbn) => {
    // 根据 `isbn` 请求书籍信息
    let url = '/api/admin/manager/book/search'
    let params = {
        by: 0,
        value: isbn
    }
    let res = async function () {
        let book = {}
        await axios.get(url, { params: params }, { header: { 'ContentType': 'application/json' } })
            .then(res => {
                book = res.data.books[0]
            })
            .catch(err => {
                console.log(err)
                dialogVisible = false
                return
            })
        return book
    }()
    res.then(book => {
        // 处理 json 数据
        let form = {
            isbn: book.isbn,
            name: book.name,
            author: book.author,
            public: book.public,
            publicDate: book.public_date,
            stock: book.stock,
        }
        dialogData.value.bookType.forEach(value => {
            if (value.id === book.type_id) {
                form.typeName = value.name
                return
            }
        })
        initForm(form)
        dialogSend.value = 'modify'
        dialogVisible.value = true
    })
}

// dialog => 表单检查
const checkForm = () => {
    let formData = dialogData.value.form
    if (formData.isbn === '' || formData.name === '' || formData.author === '' ||
        formData.typeName === '' || formData.public === '' ||
        formData.publicDate === '' || formData.stock === 0) {
        return false
    } else {
        return true
    }
}

// dialog => 初始化表单数据
const initForm = (form) => {
    dialogData.value.form = {
        isbn: form.isbn, name: form.name, author: form.author, typeName: form.typeName,
        public: form.public, publicDate: form.publicDate, stock: form.stock,
    }
}

// dialog => 清除表单
const cleanForm = () => {
    dialogData.value.form = {
        isbn: '', name: '', author: '', typeName: '', public: '', publicDate: '', stock: Number,
    }
}

// dialog: 发送表单 => 添加图书
const sendFormOfAddBook = () => {
    // 新建图书 ["POST", "/api/admin/manager/book"]
    let url = '/api/admin/manager/book'
    let typeId = -1
    switch (dialogData.value.form.typeName) {
        case '小说':
            typeId = 1
            break
        case '历史':
            typeId = 2
            break
        case '科技':
            typeId = 3
            break
        case '哲学':
            typeId = 4
            break
        case '经济':
            typeId = 5
            break
        case '工程技术':
            typeId = 6
            break
        case '心理':
            typeId = 7
            break
        case '互联网':
            typeId = 8
            break
        case '自然科学':
            typeId = 9
            break
    }
    let params = {
        isbn: dialogData.value.form.isbn,
        name: dialogData.value.form.isbn,
        type_id: typeId,
        author: dialogData.value.form.author,
        public: dialogData.value.form.public,
        public_date: dialogData.value.form.publicDate,
        stock: dialogData.value.form.stock,
    }
    if (!checkForm()) {
        alert('请正确填写信息')
        return
    }
    axios.post(url, params, { headers: { 'ContentType': 'application/json' } })
        .then(res => {
            if (res.data.code === 1) {
                alert('添加成功')
                dialogVisible.value = false
                tableMethod.updatePage()
                cleanForm()
            }
            else
                alert('添加失败')
        })
        .catch(err => {
            console.log(err)
            alert('未知错误!')
        })
}

// dialog: 发送表单 => 修改图书 
const sendFormOfModifyBook = () => {
    let url = '/api/admin/manager/book/update'
    let form = dialogData.value.form
    let params = {
        isbn: form.isbn,
        name: form.name,
        type_id: -1,
        author: form.author,
        public: form.public,
        public_date: form.publicDate,
        stock: form.stock,
    }
    dialogData.value.bookType.forEach(value => {
        if (value.name === form.typeName) {
            params.type_id = value.id
            return
        }
    })
    axios.post(url, params, { headers: { 'ContentType': 'application/json' } })
        .then(res => {
            if (res.data.code === 1) {
                alert('更新成功')
                tableMethod.updatePage()
                dialogVisible.value = false
                cleanForm()
            }
            else
                alert('更新失败!')
        })
        .catch(err => {
            console.log(err)
        })
}

// 监听器 => 当 dialog 关闭时清除表单数据
watch(dialogVisible, (newVal, oldVal) => {
    if (newVal === false) {
        cleanForm()
    }
})

onBeforeMount(() => {
    // 登录验证
    axios.get("/api/admin/login")
        .then(res => {
            if (res.data.code == -1) {
                router.push("/admin/login")
            }
        })
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

.modify-title {
    padding-left: 5px;
    padding-right: 5px;
    margin: 10px auto 20px;
}

.title-icon {
    background-image: url("@/assets/img/modify.png");
    background-size: 32px 32px;
    display: inline-block;
    height: 32px;
    width: 32px;
    vertical-align: middle;
}

.title-text {
    margin-left: 10px;
    vertical-align: middle;
}

.form-item {
    margin: 15px 0;
}

.form-item>label {
    width: 4em;
}

.send-btn {
    width: 40%;
    margin-left: auto;
    margin-right: auto;
}

.send-btn>input {
    margin-right: 10px;
    background-color: #13f15d;
    /*border: 2px solid #582e86;*/
    border: 0;
    color: #202a29;
    border-radius: 5px;
    padding: 5px;
}

.send-btn>input:hover {
    background-color: #7d8bd0;
    /*color: #f2f2f2;*/
    transition: 0.5s;
}


.form-select {
    display: inline-block;
    width: 64%;
}

label {
    margin-right: 20px;
}

.input-item {
    width: 40% !important;
}
</style>