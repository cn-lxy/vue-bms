<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="modify-title">
                        <span class="title-icon"></span>
                        &nbsp;用户注册
                    </div>
                    <form class="form" autocomplete="off">
                        <div class="form-item">
                            <label for="name">姓名</label>
                            <input v-model="name" type="text" id="name" name="name" maxlength="20">
                        </div>
                        <div class="form-item">
                            <label for="account">账号</label>
                            <input v-model="account" type="text" id="account" name="account" maxlength="20"
                                autocomplete="off">
                        </div>
                        <div class="form-item">
                            <label for="password">密码</label>
                            <input v-model="password" type="password" id="password" name="password" maxlength="20">
                        </div>
                        <div class="form-item">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" v-model="sex" type="radio" name="sex" id="man"
                                    value="男">
                                <label class="form-check-label" for="man">男</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" v-model="sex" type="radio" name="sex" id="women"
                                    value="女">
                                <label class="form-check-label" for="women">女</label>
                            </div>
                        </div>
                        <div class="form-item">
                            <label for="college">学院</label>
                            <input v-model="college" type="text" id="college" name="college" maxlength="30">
                        </div>
                        <div class="form-item">
                            <label for="birthday">出生日期</label>
                            <input v-model="birthday" type="date" id="birthday" name="birthday">
                        </div>
                        <div class="form-item">
                            <div class="send-btn">
                                <input type="button" value="注册" @click="register">
                                <input type="reset" value="重置">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "RegisterCard",
    data() {
        return {
            name: "",
            account: "",
            password: "",
            sex: "",
            college: "",
            birthday: ""
        }
    },
    methods: {
        register: function () {
            if (this.name === "" || this.account === "" || this.password === "" || this.sex === "" || this.college === "" || this.birthday === "") {
                alert('请填写完整信息')
                return
            }
            let data = {
                name: this.name,
                account: this.account,
                password: this.password,
                sex: this.sex,
                college: this.college,
                birthday: this.birthday
            }
            axios.post(
                "/api/user/register",
                data,
                { headers: { 'Content-Type': 'application/json' } }
            ).then(res => {
                if (res.data.code === 1) {
                    alert('注册成功!')
                    this.$router.push({ name: 'userLogin' })
                } else if (res.data.code === -1) {
                    alert('该账号已存在')
                } else {
                    alert('注册失败')
                }
            }).catch(err => {
                console.log(err)
            })

            // this.$router.push("/register");
        }
    }
}
</script>


<style scoped>
@import '@/assets/css/bootstrap.min.css';

.container {
    /* height: 82vh; */
    padding-top: 1.5rem !important;
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
    margin: auto;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-left: -12px;
    padding-right: -12px;
    flex-wrap: wrap;
    width: 100%;
}

.col {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 2 1 auto;
    padding-left: 12px;
    padding-right: 12px;
    flex-basis: 0;
}

.card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    align-items: center;
    background-color: #22212c;
    border: 1px solid #454158;
    border-radius: .5rem;
    margin-top: 50px;
    margin-bottom: 1.5rem;
    margin-left: auto;
    margin-right: auto;
    padding: .5rem;
    max-height: 80vh !important;
    width: 40%;
    box-shadow: #392479 0 0 60px;
    border: 2px solid #322e4b;
}

.card img {
    border-radius: 50%;
    vertical-align: middle;
    padding: 10px;
}

.card:hover {
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
    background-image: url("@/assets/img/register.png");
    background-size: 48px 48px;
    display: inline-block;
    height: 48px;
    width: 48px;
    vertical-align: middle;
}

.form-item {
    /* margin: 15px 5px; */
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
}

.form-item>label {
    width: 4em;
    padding-right: 5px;
}

.form-item:nth-of-type(4) {
    padding-left: 70px;
}

.send-btn {
    display: inline;
    width: 40%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 60px;
}

.send-btn>input {
    margin-right: 10px;
    background-color: #13f15d;
    border: 2px solid #582e86;
}
</style>