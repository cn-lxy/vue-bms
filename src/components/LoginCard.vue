<template>
	<div class="box">
		<div class="card">
			<div class="login-title">
				<img alt="Vue logo" class="icon" src="@/assets/svg/user.svg" width="40" height="40" />
				<span style="display: inline-block;padding-top: 4px;padding-left: 10px;">用户登录</span>
			</div>
			<form autocomplete="off">
				<div class="form-input">
					<label for="user">账号&nbsp;&nbsp;<input v-model.lazy.trim="account" type="text" name="account"
							id="user" placeholder="请输入账号" autocomplete="off"></label>
					<label for="password">密码&nbsp;&nbsp;<input v-model.lazy.trim="password" type="password"
							name="password" id="password" placeholder="请输入密码"></label>
				</div>
				<div class="func">
					<input type="button" value="登录" @click="login">
					<input type="reset" value="重置">
				</div>
				<div class="func">
					<span>没有账号?&nbsp;</span>
					<a href="/user/register">去注册</a>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import LoginIcon from '@/assets/img/icon/login.png'

export default {
	name: "LoginCard",
	data() {
		return {
			account: '',
			password: '',
			url: '/api/user/login'
		}
	},
	methods: {
		login: function () {
			axios
				.post(this.url, {
					account: this.account,
					password: this.password
				}, {
					headers: { 'Content-Type': 'application/json' }
				}
				)
				.then(response => {
					if (response.status === 200 && response.data.code === 1) {
						alert('登录成功')
						// 数据本地化
						localStorage.setItem('uid', response.data.id)
						localStorage.setItem('name', response.data.name)
						this.$router.push({ name: "userHome", params: { id: response.data.id } })
					} else {
						alert('用户名或密码错误!')
					}
				})
				.catch(error => {
					console.log(error)
				})
		}
	},
	setup() {
		// 更改 favicon
		document.getElementsByTagName('link')[0].href = LoginIcon
	}
}
</script>

<style scoped>
.box {
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	flex-wrap: wrap;
	width: 100%;
	height: 100%;
}

.card {
	/*width: 25%;*/
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;

	box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
	border-radius: 15px;
	background: rgba(255, 255, 255, 0.1);
	overflow: hidden;
	border-top: 1px solid rgba(255, 255, 255, 0.5);
	border-left: 1px solid rgba(255, 255, 255, 0.5);
	backdrop-filter: blur(5px);
}

.login-title {
	padding-left: 5px;
	padding-right: 5px;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 15px;
}

.icon {
	vertical-align: middle;
}

.form-input {
	display: flex;
	flex-direction: column;
}

.form-input label {
	padding: 10px
}

.func {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
}

.func input {
	margin: 10px;
	background-color: #8aff80;
}

input:active {
	background-color: skyblue;
}

.icon {
	vertical-align: middle;
}

label {
	padding: 10px;
}
</style>