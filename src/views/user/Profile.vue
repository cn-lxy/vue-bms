<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { getCurrentInstance, onBeforeMount, ref } from 'vue';
import profileIcon from '@/assets/img/icon/profile.png'
import axios from 'axios';

const internalInstance = getCurrentInstance()
const globalProps = internalInstance?.appContext.config.globalProperties

globalProps.$user.updateUser()

const data = ref({
    header: {
        title: '个人信息',
        msg: '欢迎您!',
        name: '',
        url: ''
    },
    user: {
        id: -1,
        name: "null",
        account: "null",
        password: 'null',
        birthday: "2000-01-01",
        college: "null",
        sex: "女",
    }
})

const getUserInfo = () => {
    axios.get('/api/user/info',
        { params: { uid: globalProps.$user.id } },
        { header: { 'ContentType': 'application/json' } }
    ).then(res => {
        data.value.user = res.data.user
        data.value.header.name = res.data.user.name
    })
}

const updateLocalData = () => {
    axios.get('/api/user/info',
        { params: { uid: globalProps.$user.id } },
        { header: { 'ContentType': 'application/json' } }
    ).then(res => {
        localStorage.setItem('name', res.data.user.name)
    })
}

const postModify = () => {
    let { id, name, account, password, birthday, college, sex } = data.value.user
    let params = {
        id, name, account, password, birthday, college, sex
    }
    console.log(params)
    axios.post('/api/user/modify',
        params,
        { headers: { 'ContentType': 'application/json' } }
    ).then(res => {
        // 信息更新成功 => 更新本地数据
        alert('更新成功!')
        getUserInfo()
        updateLocalData()
    }).catch(err => {
        console.log(err)
    })
}

onBeforeMount(() => {
    document.getElementsByTagName('link')[0].href = profileIcon
    document.getElementsByTagName('title')[0].innerText = data.value.header.title

    getUserInfo()
})
</script>

<template>
    <div>
        <Header v-bind="data.header" />
        <div class="main-container">
            <div class="row">
                <div class="col">
                    <div class="card card-profile">
                        <div class="modify-title">
                            <span class="title-icon"></span>
                            &nbsp;更改信息
                        </div>
                        <form autocomplete="off">
                            <div class="form-item">
                                <label for="name">姓名</label>
                                <input type="text" id="name" name="name" maxlength="20" v-model="data.user.name">
                            </div>
                            <div class="form-item">
                                <label for="account">账号</label>
                                <input type="text" id="account" name="account" maxlength="20"
                                    v-model="data.user.account">
                            </div>
                            <div class="form-item">
                                <label for="password">密码</label>
                                <input type="text" id="password" name="password" maxlength="20"
                                    v-model="data.user.password">
                            </div>
                            <div class="form-item">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="sex" id="man" value="男"
                                        v-model="data.user.sex">
                                    <label class="form-check-label" for="man">男</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="sex" id="women" value="女"
                                        v-model="data.user.sex">
                                    <label class="form-check-label" for="women">女</label>
                                </div>
                            </div>
                            <div class="form-item">
                                <label for="college">学院</label>
                                <input type="text" id="college" name="college" maxlength="30"
                                    v-model="data.user.college">
                            </div>
                            <div class="form-item">
                                <label for="birthday">出生日期</label>
                                <input type="date" id="birthday" name="birthday" v-model="data.user.birthday">
                            </div>
                            <div class="form-item">
                                <div class="send-btn">
                                    <input type="button" value="提交" @click="postModify">
                                    <input type="button" value="重置" @click="getUserInfo">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
@import '@/assets/css/init.css';
@import '@/assets/css/bootstrap.min.css';

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
    justify-content: flex-start;
    flex-direction: column;
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
    transition: .2s;
    box-shadow: #26135b 0 0 60px;
    border: 1px solid #322e4b;
}

.modify-title {
    padding-left: 5px;
    padding-right: 5px;
    margin: 10px auto 15px;
}

.title-icon {
    background-image: url("../../assets/img/modify.png");
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
    width: 5em;
}

.form-item:nth-of-type(4) {
    padding-left: 70px;
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
</style>