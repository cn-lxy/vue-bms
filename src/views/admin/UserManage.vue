<template>
    <Header v-bind="data.header" />
    <div class="main-container">
        <div class="row">
            <div class="col item-1">
                <div class="card"><a href="/admin/manage/borrow">借阅管理</a></div>
                <div class="card"><a href="/admin/manage/book">图书管理</a></div>
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
                                <td><a href="javascript:void(0);" @click="modifyEvent(rowData.id)">修改</a></td>
                                <td>
                                    <a href="javascript:void(0)" @click="tableMethod.delUserEvent(rowData.id)">删除</a>
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
                <div class="card">
                    <a href="javascript:void(0);" @click="addUserEvent">添加用户</a>
                </div>
                <div class="card">
                    <div style="margin-left: 0; margin-bottom: 5px">搜索</div>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" placeholder="search" id="search-field"
                            v-model.trim="data.search.key">
                        <button class="btn btn-outline-secondary" type="button" id="search-btn"
                            @click="searchEvent">Search</button>
                    </div>
                    <div class="search-type">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="by-default"
                                value="default" v-model="data.search.checked">
                            <label class="form-check-label" for="by-sex">
                                默认&nbsp;&nbsp;
                            </label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="by-name"
                                value="name" v-model="data.search.checked">
                            <label class="form-check-label" for="by-name">
                                姓名&nbsp;&nbsp;
                            </label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="by-account"
                                value="account" v-model="data.search.checked">
                            <label class="form-check-label" for="by-account">
                                学号&nbsp;&nbsp;
                            </label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="by-sex" value="sex"
                                v-model="data.search.checked">
                            <label class="form-check-label" for="by-sex">
                                性别&nbsp;&nbsp;
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model="dialogVisible">
        <div class="add-book">
            <div class="modify-title">
                <span class="title-icon"></span>
                <span class="title-text">添加用户</span>
            </div>
            <form autocomplete="off" method="post" action="">
                <div class="form-item">
                    <label for="isbn">姓名</label>
                    <input type="text" id="name" name="name" maxlength="20" v-model="dialogData.form.name"
                        class="input-item">
                </div>
                <div class="form-item">
                    <label for="account">账号</label>
                    <input type="text" id="account" name="account" maxlength="20" class="input-item"
                        v-model="dialogData.form.account">
                </div>
                <div class="form-item">
                    <label for="password">密码</label>
                    <input type="text" id="password" name="password" maxlength="20" class="input-item"
                        v-model="dialogData.form.password">
                </div>
                <div class="form-item">
                    <label for="sex">性别</label>
                    <span class="input-item">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input sex-input" type="radio" name="sex" id="man" value="男"
                            v-model="dialogData.form.sex"/>
                            <label class="form-check-label" for="man">男</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input sex-input" type="radio" name="sex" id="women" value="女"
                                v-model="dialogData.form.sex" />
                            <label class="form-check-label" for="women">女</label>
                        </div>
                    </span>
                </div>
                <div class="form-item">
                    <label for="college">学院</label>
                    <input type="text" id="college" name="college" v-model="dialogData.form.college" class="input-item">
                </div>
                <div class="form-item">
                    <label for="birthday">生日</label>
                    <el-date-picker v-model="dialogData.form.birthday" value-format="YYYY-MM-DD" type="date"
                        placeholder="Pick a day" class="input-item" />
                </div>
                <div class="form-item">
                    <div class="send-btn">
                        <input type="button" value="提交"
                            @click="dialogSend == 'add' ? sendFormOfAddUser() : sendFormOfModifyUser()">
                        <input type="button" value="重置" @click="dialogSend == 'add' ? addReset() : modifyReset()">
                    </div>
                </div>
            </form>
        </div>
    </Dialog>
    <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import UserManageIcon from '@/assets/img/user.png'
import Dialog from '@/components/Dialog.vue'
import { ref, onBeforeMount, watch } from 'vue'
import axios from 'axios'

const title = '用户管理'
const req = ref({
    search: {
        url: '/api/admin/manager/user/search',
        params: {
            by: -1,
            key: '',
        }
    },
    default: {
        url: '/api/admin/manager/users',
        params: {
            limit: 10,
            offset: 0,
        },
    },
})
const dialogVisible = ref(false)
const dialogSend = ref('')  // add / modify
const dialogData = ref({
    form: {
        name: '',
        account: '',
        password: '',
        sex: '男',
        college: '',
        birthday: '',
    },
    uid: Number,
})
// 全局数据
const data = ref({
    header: {
        title: '图书管理',
        titleLink: '/admin/manage/user',
        msg: '欢迎您!',
        name: 'admin',
    },
    table: {
        title: [
            '#', '姓名', '账号', '密码', '性别', '学院', '生日', '注册时间'
        ],
        rowData: [
            {
                id: '-1',
                data: ['小明', '2019001', '123456', '男', '信息与通信工程学院', '2000-10-19', '2022-07-06 18:24:58']
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
        checked: 'default',
        key: '',
    },
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
                books = res.data.users
            })
            .catch(err => {
                console.log(err)
            })
        return books
    },
    parseData: function (data) {
        let tableRowData = []
        console.log(data)
        data.forEach((e) => {
            tableRowData.push({
                id: e.id,
                yes: e.stock > 0 ? true : false,
                data: [e.name, e.account, e.password, e.sex, e.college, e.birthday, e.register]
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
    delUserEvent: function (uid) {
        if (confirm('确认删除?') === false)
            return
        let url = `/api/admin/manager/user/delete?id=${uid}`
        axios.get(url, { headers: { 'ContentType': 'application/json' } })
            .then(res => {
                console.log(res.data)
                if (res.data.code === 1) {
                    alert('删除成功')
                    tableMethod.updatePage()
                }
                else
                    alert('删除失败!')
            })
            .catch(err => {
                console.log(err)
                alert('删除失败!')
            })
    }
}

// click: 搜索点击事件
const searchEvent = () => {
    if (data.value.search.checked === 'default') {
        data.value.table.page.url = req.value.default.url
        data.value.table.page.params = req.value.default.params
    } else {
        let by = -1
        switch (data.value.search.checked) {
            case 'default':
                by = -1
                break
            case 'name':
                by = 0
                break
            case 'account':
                by = 1
                break
            case 'sex':
                by = 2
                break
            default:
                by = -1
                break
        }
        req.value.search.params.by = by
        req.value.search.params.key = data.value.search.key
        data.value.table.page.url = req.value.search.url
        data.value.table.page.params = req.value.search.params
        tableMethod.updatePage()
    }
}

// click: 添加用户点击事件
const addUserEvent = () => {
    dialogSend.value = 'add'
    dialogVisible.value = true
}
// click: 修改用户点击事件
const modifyEvent = (uid) => {
    initForm(uid)
    dialogData.value.uid = uid
    dialogVisible.value = true
    dialogSend.value = 'modify'
}

// dialog => 初始化表单
const initForm = (uid) => {
    let res = async function () {
        let url = '/api/admin/manager/user/search'
        let params = {
            by: 3,  // uid
            key: uid,
            limit: 1,
            offset: 0,
        }
        let user = {}
        await axios.get(url, { params: params }, { header: { 'ContentType': 'application/json' } })
            .then(res => {
                user = res.data.users[0]
            })
            .catch(err => {
                console.log(err)
            })
        return user
    }()
    res.then(user => {
        console.log(user)
        if (user === null) {
            alert('未知错误!')
            return
        }
        // 数据处理
        dialogData.value.form = {
            name: user.name,
            account: user.account,
            password: user.password,
            sex: user.sex,
            college: user.college,
            birthday: user.birthday,
        }
    })
}

// dialog => 表单检查
const checkForm = () => {
    let formData = dialogData.value.form
    if (formData.name === '' || formData.account === '' || formData.password === '' ||
        formData.sex === '' || formData.college === '' || formData.birthday === '') {
        return false
    } else {
        return true
    }
}

// dialog => 清除表单
const cleanForm = () => {
    dialogData.value.form = {
        name: '',
        account: '',
        password: '',
        sex: '男',
        college: '',
        birthday: '',
    }
}

// dialog: 发送表单 => 添加用户
const sendFormOfAddUser = () => {
    if (!checkForm()) {
        alert('请正确填写表单')
        return
    }
    let url = '/api/admin/manager/user'
    let params = dialogData.value.form
    axios.post(url, params, { headers: { 'ContentType': 'application/json' } })
        .then(res => {
            console.log(res.data)
            if (res.data.code === 1) {
                alert('添加成功')
                dialogVisible.value = false
            }
            else
                alert('添加失败!')
        })
        .catch(err => {
            console.log(err)
        })
}

// dialog: 发送表单 => 更改用户
const sendFormOfModifyUser = () => {
    if (!checkForm()) {
        alert('请正确填写表单')
        return
    }
    let url = '/api/admin/manager/user/update'
    let params = dialogData.value.form
    axios.post(url, params, { headers: { 'ContentType': 'application/json' } })
        .then(res => {
            console.log(res.data)
            if (res.data.code === 1) {
                alert('更新成功')
                dialogVisible = false
            } else
                alert('更新失败!')
        })
        .catch(err => {
            console.log(err)
        })
}

// dialog: 添加书籍重置
const addReset = () => {
    cleanForm()
}
// dialog: 修改书籍重置
const modifyReset = () => {
    initForm(dialogData.value.uid)
}

// 监听器 => 当 dialog 关闭时清除表单数据
watch(dialogVisible, (newVal, oldVal) => {
    if (newVal === false) {
        cleanForm()
    }
})

onBeforeMount(() => {
    document.getElementsByTagName('title')[0].innerText = title
    document.getElementsByTagName('link')[0].href = UserManageIcon
    tableMethod.updatePage()
})
</script>

<style scoop>
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

.table>* {
    color: #f2f2f2 !important;
}

.table th:hover {
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
    margin-right: 10px;
}

.input-item {
    width: 40% !important;
}
</style>