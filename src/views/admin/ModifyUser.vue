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
                            <label for="uname">姓名</label>
                            <input class="input-item" type="text" id="uname" name="uname" maxlength="20" v-model="data.user.name">
                        </div>
                        <div class="form-item">
                            <label for="account">账号</label>
                            <input class="input-item" type="text" id="account" name="account" maxlength="20" v-model="data.user.account">
                        </div>
                        <div class="form-item">
                            <label for="password">密码</label>
                            <input class="input-item" type="text" id="password" name="password" maxlength="20" v-model="data.user.password">
                        </div>
                        <div class="form-item">
                            <label for="sex">性别</label>
                            <input class="input-item" type="text" id="sex" name="sex" maxlength="20" v-model="data.user.sex">
                        </div>
                        <div class="form-item">
                            <label for="college">学院</label>
                            <input class="input-item" type="text" id="college" name="college" v-model="data.user.college">
                        </div>
                        <div class="form-item">
                            <label for="birthday">生日</label>
                            <el-date-picker  class="input-item" v-model="data.user.birthday" value-format="YYYY-MM-DD" type="date"
                                placeholder="Pick a month" name="birthday"/>
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
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModifyUserIcon from '@/assets/img/modify.png'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const title = '更改用户信息'
const data = ref({
    header: {
        title: title,
    },
    user: {
        id: -1,
        name: '',
        account: '',
        password: '',
        sex: '',
        college: '',
        birthday: '',
    },
})

const requestUser = async () => {
    let url = '/api/admin/manager/user/search'
    let params = {
        by: 3,  // uid
        key: data.value.user.id,
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
}

const parseReq = (user) => {
    data.value.user = user
}

const initUser = () => {
    let res = requestUser()
    res.then(user => {
        parseReq(user)
    })
}

const modifyEvent = () => {
    let url = '/api/admin/manager/user/update'
    let params = data.value.user
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
    initUser()
}

onBeforeMount(() => {
    document.getElementsByTagName('title')[0].innerText = title
    document.getElementsByTagName('link')[0].href = ModifyUserIcon
    data.value.user.id = route.params.uid
    initUser()
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