<template>
    <Header v-bind="data.header" />
    <div class="main-container">
        <div class="row">
            <div class="col">
                <div class="card card-profile">
                    <div class="modify-title">
                        <span class="title-icon"></span>
                        &nbsp;更改图书信息
                    </div>
                    <form autocomplete="off" method="post" action="">
                        <input type="number" name="id" value="" hidden>
                        <div class="form-item">
                            <label for="isbn">ISBN</label>
                            <input type="text" id="isbn" name="isbn" maxlength="20" v-model="data.book.isbn" disabled class="input-item">
                        </div>
                        <div class="form-item">
                            <label for="bookName">书名</label>
                            <input type="text" id="bookName" name="bookName" maxlength="20"
                                v-model="data.book.name" class="input-item">
                        </div>
                        <div class="form-item">
                            <label for="author">作者</label>
                            <input type="text" id="author" name="author" maxlength="20" v-model="data.book.author" class="input-item">
                        </div>
                        <div class="form-item">
                            <label for="typeID">书籍类型</label>
                            <select class="form-select form-select-sm input-item" id="typeID" name="typeID" style="display:inline-block;"
                                v-model="data.book.typeName">
                                <option v-for="type in data.bookType">
                                    {{ type.name }}
                                </option>
                                {{ data.bookType[0].name }}
                            </select>
                        </div>
                        <div class="form-item">
                            <label for="press">出版社</label>
                            <input type="text" id="press" name="press" v-model="data.book.public" class="input-item">
                        </div>
                        <div class="form-item">
                            <label for="pressDate">出版时间</label>
                            <el-date-picker v-model="data.book.publicDate" value-format="YYYY-MM" type="month"
                                placeholder="Pick a month" class="input-item"/>
                        </div>
                        <div class="form-item">
                            <label for="stock">库存</label>
                            <input type="number" id="stock" name="stock" min="0" v-model="data.book.stock" class="input-item">
                        </div>
                        <div class="form-item">
                            <div class="send-btn">
                                <input type="button" value="提交" @click="modifyEvent">
                                <input type="button" value="重置" @click="resetEvent">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { ref, onBeforeMount, onMounted } from 'vue'
import AdminIcon from '@/assets/img/modify.png'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const title = '修改图书'
const data = ref({
    header: {
        title: title,
    },
    bookType: [
        { id: 1, name: '小说' },
        { id: 2, name: '历史' },
        { id: 3, name: '政治' },
        { id: 4, name: '哲学' },
        { id: 5, name: '经济' },
        { id: 6, name: '工程技术' },
        { id: 7, name: '心理' },
        { id: 8, name: '互联网' },
        { id: 9, name: '自然科学' },
    ],
    typeSelect: '',
    book: {
        isbn: '',
        name: '',
        author: '',
        typeName: '',
        public: '',
        publicDate: '',
        stock: 0
    },
})

const requestBook = async (isbn) => {
    let url = '/api/admin/manager/book/search'
    let params = {
        by: 0,
        value: isbn
    }
    let book = {}
    await axios.get(url, { params: params }, { header: { 'ContentType': 'application/json' } })
        .then(res => {
            book = res.data.books[0]
        })
        .catch(err => {
            console.log(err)
        })
    return book
}

const parseReq = (book) => {
    data.value.book.isbn = book.isbn
    data.value.book.name = book.name
    data.value.book.author = book.author

    data.value.bookType.forEach(value => {
        if (value.id === book.type_id) {
            data.value.book.typeName = value.name
            return
        }
    })

    data.value.book.public = book.public
    data.value.book.public = book.public
    data.value.book.publicDate = book.public_date
    data.value.book.stock = book.stock
}

const initBook = (isbn) => {
    let book = requestBook(isbn)
    book.then(_b => {
        parseReq(_b)
    })
}

const modifyEvent = () => {
    let url = '/api/admin/manager/book/update'
    let book = data.value.book
    let params = {
        isbn: book.isbn,
        name: book.name,
        type_id: -1,
        author: book.author,
        public: book.public,
        public_date: book.publicDate,
        stock: book.stock,
    }
    data.value.bookType.forEach(value => {
        if (value.name === book.typeName) {
            params.type_id = value.id
            return
        }
    })
    axios.post(url, params, { headers: { 'ContentType': 'application/json' } })
        .then(res => {
            console.log(res.data)
            if (res.data.code === 1)
                alert('更新成功')
            else 
                alert('更新失败!')
        })
        .catch(err => {
            console.log(err)
        })
}

const resetEvent = () => {
    initBook(route.params.isbn)
}

onBeforeMount(() => {
    document.getElementsByTagName('title')[0].innerText = title
    document.getElementsByTagName('link')[0].href = AdminIcon
    initBook(route.params.isbn)
})
</script>

<style>
@import '@/assets/css/bootstrap.min.css';
@import '@/assets/css/init.css';

.main-container {
    height: 82vh;
    padding-top: 1.5rem !important;
    /*max-width: 1140px;*/
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
    margin: auto;
}

.row {
    display: flex;
    justify-content: center;
    flex-direction: row;
    padding-left: -12px;
    padding-right: -12px;
    flex-wrap: wrap;
    width: 100%;
}

.col {
    position: relative;
    flex: 2 1 auto;
    padding-left: 12px;
    padding-right: 12px;
    flex-basis: 0;
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
}

.card img {
    border-radius: 50%;
    vertical-align: middle;
    padding: 10px;
}

.card-profile {
    width: 40%;
    justify-content: flex-start;
    flex-direction: column;
    margin-top: 50px;
    margin-right: auto;
    margin-left: auto;
    align-items: center;
    box-shadow: #392479 0 0 60px;
    border: 2px solid #322e4b;
}

.card-profile:hover {
    transition: 1s;
    box-shadow: #26135b 0 0 60px;
    border: 1px solid #322e4b;
}

.modify-title {
    padding-left: 5px;
    padding-right: 5px;
    margin: 10px auto 15px;
}

.title-icon {
    background-image: url("@/assets/img/modify.png");
    background-size: 48px 48px;
    display: inline-block;
    height: 48px;
    width: 48px;
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
    border: 2px solid #582e86;
}

.form-select {
    display: inline-block;
    width: 64%;
}

label {
    margin-right: 40px;
}

.input-item {
    width: 60%  !important;
}
</style>