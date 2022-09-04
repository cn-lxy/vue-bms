<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Table from '@/components/Table.vue'
import libraryIcon from '@/assets/img/icon/library.png'

import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const titles = ['所有借阅', '待还借阅', '历史借阅']
const data = ref({
    title: '',
    // Table 组件数据
    table: {
        title: [
            '#', '书名', '借阅天数', '借阅时间', '归还时间'
        ],
        rowData: [
            // BUG
            // {
            //     // id: 1,
            //     // yes: false,
            //     // data: []
            // },
        ],
        link: { title: '归还', url: '/api/user/back' },
        page: { page: 1, pageLen: 10 },
    },
    type: route.query.type,
    url: {
        all: '/api/user/borrowed',
        ing: '/api/user/not_back',
        ed: '/api/user/backed',
    }
})
const method = {
    // 获取借阅数据
    async reqData(url, params) {
        let borrowInfos = []
        await axios.get(
            url,
            { params: params },
            { headers: { 'Content-Type': 'application/json' } }
        ).then(res => {
            borrowInfos = res.data
        }).catch(err => {
            console.log(err)
        })
        return borrowInfos
    },
    // 解析借阅数据
    parseData(originData) {
        let borrowInfos = []
        originData.bs.forEach(item => {
            let borrow = {
                id: item.id,
                yes: item.backDate === 'NULL' ? true : false,
                data: {
                    bookName: item.bookName,
                    borrowDays: item.days,
                    borrowTime: item.borrowDate,
                    borrowStatus: item.backDate === 'NULL' ? '未归还' : item.backDate,
                }
            }
            borrowInfos.push(borrow)
        })
        data.value.table.rowData = borrowInfos
    },
    get() {
        let url = ''
        switch (data.value.type) {
            case 'all':
                url = data.value.url.all
                data.value.title = titles[0]
                break
            case 'ing':
                url = data.value.url.ing
                data.value.title = titles[1]
                break
            case 'ed':
                url = data.value.url.ed
                data.value.title = titles[2]
                break
        }
        let params = {
            id: localStorage.getItem('uid')*1,
            limit: data.value.table.page.pageLen,
            offset: (data.value.table.page.page - 1) * data.value.table.page.pageLen,
        }
        let res_data = this.reqData(url, params)
        res_data.then(data => {
            if (data.bs === null)
                return false
            this.parseData(data)
            return true
        })
    },
    upPage() {
        if (data.value.table.page.page > 1) {
            data.value.table.page.page--
            method.get()
        }
    },
    downPage() {
        data.value.table.page.page++
        if (!method.get()) {
            data.value.table.page.page--
        }
    },
    link(bid) {
        // 输入借阅天数
        let backTrue = confirm('确认归还?')
        if (!backTrue) {
            return
        }
        let url = data.value.table.link.url
        axios.get(url,
            {
                params: {
                    id: bid, // borrow id 
                }
            }
        )
            .then(res => {
                console.log(res)
                if (res.data.code === 1) {
                    alert('归还成功')
                    // 借阅成功后 刷新table
                    method.get()
                } else {
                    alert('归还失败')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}

onBeforeMount(() => {
    // 更换 favicon
    document.getElementsByTagName('link')[0].href = libraryIcon
    method.get()
    document.getElementsByTagName('title')[0].innerText = data.value.title
})
</script>

<template>
    <Header :title="data.title" />
    <div class="main-container">
        <div class="row">
            <div class="col item-2">
                <!-- <Table/> -->
                <Table :table="data.table" @up-page="method.upPage" @down-page="method.downPage" @link="method.link" />
            </div>
        </div>
    </div>
    <Footer />
</template>

<style >
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
    justify-content: center;
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

.item-2 {
    max-width: 60%;
}

.back {
    color: #7d8bd0;
}

.back:hover {
    color: #13f15d !important;
}

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