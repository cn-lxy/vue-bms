<template>
    <div>
        <Header v-bind="data.header" />
        <div class="main-container">
            <div class="row">
                <div class="col item-1">
                    <GuideCard :guides="data.guideCard" :uid="data.user.id" />
                </div>
                <div class="col item-2">
                    <!-- table -->
                    <Table :table="data.table" @upPage="tableMethod.upPage" @downPage="tableMethod.downPage"
                        @link="tableMethod.link" />
                </div>
                <div class="col item-3">
                    <SearchBar @dataTransfer="dataTransfer" />
                    <BookSort :types="data.bookSort" @sortEvent="sortEvent" />
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup >
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import GuideCard from '@/components/GuideCard.vue'
import Table from '@/components/Table.vue'
import BookSort from '@/components/BookSort.vue'
import SearchBar from '@/components/SearchBar.vue'

import HomeIcon from '@/assets/img/icon/home.png'
import { ref, onBeforeMount, watch, getCurrentInstance } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

// 全局变量
const internalInstance = getCurrentInstance()
const globalProps = internalInstance?.appContext.config.globalProperties

// table 组件数据请求信息
const req = ref({
    search: {
        url: '/api/user/book/search',
        params: {
            by: '',
            value: ''
        }
    },
    type: {
        url: '/api/user/books',
        params: {
            by: 0,  // => 0: default, 1: get by type
            typeId: -1
        }
    }
})

const data = ref({
    // Header 组件数据
    header: {
        title: '用户主页',
        msg: '欢迎您!',
        id: -1,
        name: 'null',
        url: '/user/profile',
    },
    // GuideCard 组件数据
    guideCard: [
        { id: 1, msg: '所有借阅', urlName: 'borrowDetail', query: { type: 'all' }, num: 0 },
        { id: 2, msg: '待还借阅', urlName: 'borrowDetail', query: { type: 'ing' }, num: 0 },
        { id: 3, msg: '历史借阅', urlName: 'borrowDetail', query: { type: 'ed' }, num: 0 },
    ],
    // Table 组件数据
    table: {
        title: [
            '#', '书名', '书类', '作者', '出版社', '出版时间', '库存'
        ],
        rowData: [
            {
                id: '-1',
                data: ['1', 'book1', '小说', '作者1', '出版社1', '2019-1', 100]
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
    // BookSort 组件数据
    bookSort: [
        [{ id: 1, name: '小说' }, { id: 2, name: '历史' }, { id: 3, name: '政治' }],
        [{ id: 4, name: '哲学' }, { id: 5, name: '经济' }, { id: 6, name: '工程技术' }],
        [{ id: 7, name: '心理' }, { id: 8, name: '互联网' }, { id: 9, name: '自然科学' }],
    ],
    user: { id: globalProps.$user.id, name: globalProps.$user.name },
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

// 用户登录检查
const loginCheck = async () => {
    const url = '/api/user/login'
    const router = useRouter()

    await axios.get(url)
        .then(
            res => {
                if (res.data.code === -1) {
                    router.push("/user/login")
                    return false
                } else {
                    return true
                }
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
}

// 获取借阅条数
const borrowNum = {
    allBorrow: function () {
        // 用户获取所有借阅信息 ["GET", "/api/user/borrowed?id=[userId]&limit&offset"]
        let params = {
            id: data.value.user.id,
            limit: 10,
            offset: 0
        }
        const url = '/api/user/borrowed'
        axios.get(
            url, {
            params: params
        }, {
            headers: { 'Content-Type': 'application/json' }
        }
        ).then(
            res => {
                data.value.guideCard[0].num = res.data.len
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    },
    // 待还借阅
    borrowing: function () {
        // 获取用户未还借用 ["GET", "/api/user/not_back?id=[userId]&limit&offset"]
        const url = '/api/user/not_back'
        axios.get(
            url, {
            params: {
                id: data.value.user.id,
                limit: 10,
                offset: 0
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        }
        ).then(
            res => {
                data.value.guideCard[1].num = res.data.len
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    },
    // 已还借阅
    borrowed: function () {
        // 获取用户已还借阅 ["GET", "/api/user/backed?id=[userId]&limit&offset"]
        const url = '/api/user/backed'
        axios.get(
            url, {
            params: {
                id: data.value.user.id,
                limit: 10,
                offset: 0
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        }
        ).then(
            res => {
                data.value.guideCard[2].num = res.data.len
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }
}

// 点击搜索事件
const dataTransfer = ({ by, value }) => {
    req.value.search.params = { by: by, value: value }
    data.value.table.page.url = req.value.search.url
    data.value.table.page.params = req.value.search.params
}

// 书籍分类点击事件
const sortEvent = (typeId) => {
    req.value.type.params = { by: 1, typeId: typeId }
    data.value.table.page.url = req.value.type.url
    data.value.table.page.params = req.value.type.params
}

watch(data.value.table.page, (newVal, val) => {
    tableMethod.updatePage()
})

// 在此初始化
onBeforeMount(() => {
    // 更改 favicon
    document.getElementsByTagName('link')[0].href = HomeIcon
    document.getElementsByTagName('title')[0].innerText = data.value.header.title
    // 登录检查
    let status = loginCheck()
    status.then(res => {
        // 登录成功
        globalProps.$user.updateUser()
        data.value.header.id = globalProps.$user.id
        data.value.user.id = globalProps.$user.id
        data.value.header.name = globalProps.$user.name
        data.value.header.name = globalProps.$user.name
        if (data.value.user.id !== -1) {
            // 初始化数据第一页
            tableMethod.updatePage(1)
            // 获取借阅条数
            borrowNum.allBorrow()
            borrowNum.borrowing()
            borrowNum.borrowed()
        }
    })
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
</style>