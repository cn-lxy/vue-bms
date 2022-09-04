<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { onBeforeMount, ref } from 'vue'
import aboutIcon from '@/assets/img/icon/about.png'

const data = ref({
	header: {
		title: '关于项目',
	}
})

onBeforeMount(() => {
	document.getElementsByTagName('link')[0].href = aboutIcon
	document.getElementsByTagName('title')[0].innerText = data.value.header.title
})
</script>

<template>
	<Header v-bind="data.header"/>
	<div class="main-container">
		<div class="row about-row">
				<div class="col first">
					<div class="card link-1">
						<div>
							<span class="head-logo"></span>
						</div>
						<div class="introduction">
							<p>成员: 龙新宇</p>
							<p>主要负责项目规划, servlet, JavaBean, JSP与Servlet数据交互和数据库设计</p>
						</div>
					</div>
				</div>
				<div class="col second">
					<div class="card link-2">
						<div>
							<span>其他技术</span>
						</div>
						<div>
							<span id="jquery-icon"></span>
							<span>Jquery</span>
						</div>
						<div>
							<span id="bootstrap5-icon"></span>
							<sapn>BootStrap5组件</sapn>
						</div>
						<div>
							<span id="layui-icon"></span>
							<span>layDate</span>
						</div>
					</div>
				</div>
		</div>
		<div class="row about-row">
			<div class="col">
				<div class="card link-3">
					<div>
						<span class="head-logo-2"></span>
					</div>
					<div class="introduction">
						<p>成员: 刘琪源</p>
						<p>主要负责用户模块的JSP页面, CSS样式和AJAX请求，和测试的编写</p>
					</div>
				</div>
			</div>
			<div class="col">
				<div class="card link-4">
					<div>
						<span class="head-logo-3"></span>
					</div>
					<div class="introduction">
						<p>成员: 黄志毅</p>
						<p>主要负责管理员模块的JSP页面, CSS样式和AJAX请求，和测试的编写</p>
					</div>
				</div>
			</div>
		</div>
		<div class="row about-row">
			<div class="col col-idea">
				<div class="card link-5">
					<div>
						<span id="idea"></span>
					</div>
					<div class="introduction">
						<p>UI设计灵感</p>
						<a href="https://chrispederick.com/">chrispederick.com</a>
					</div>
				</div>
			</div>
			<div class="col col-deployment">
				<div class="card link-6">
					<div>
						<span id="deployment"></span>
					</div>
					<div class="introduction">
						<p>部署于阿里云ESC</p>
						<a href="http://www.longxinyu.xyz/">www.longxinyu.xyz</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Footer />
</template>

<style scoped>
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

td > a {
    color: #7d8bd0;
}
td > a:hover {
    color: #13f15d !important;
}
.navbar-container {
    justify-content: flex-start;
}
.card {
    justify-content: start;
    flex-direction: row;
    align-items: center;

}
#icon {
    display: inline-block;
    background-image: url("../assets/img/icon/about.png");
    border-radius: 50%;
    background-size: 32px 32px;
    height: 32px;
    width: 32px;
    vertical-align: middle;
    margin-right: 20px;
}
.about-row {
    width: 50%;
    margin-left: auto;
    margin-right: auto;

}
.head-logo {
    display: inline-block;
    background-image: url("../assets/img/test-man.png");
    border-radius: 50%;
    background-size: 64px 64px;
    height: 64px;
    width: 64px;
    vertical-align: middle;
}
.head-logo-2 {
    display: inline-block;
    background-image: url("../assets/img/icon/image-2.png");
    border-radius: 50%;
    background-size: 64px 64px;
    height: 64px;
    width: 64px;
    vertical-align: middle;
}
.head-logo-3 {
    display: inline-block;
    background-image: url("../assets/img/icon/image-3.png");
    border-radius: 50%;
    background-size: 64px 64px;
    height: 64px;
    width: 64px;
    vertical-align: middle;
}
.introduction {
    margin-left: 20px;
}
.first {
    flex-grow: 3;
}
.second {
    flex-grow: 1;
}

#jquery-icon {
    display: inline-block;
    vertical-align: middle;
    background-image: url("../assets/img/icon/jQuery.png");
    background-size: 25px 25px;
    width: 25px;
    height: 25px;
}
#bootstrap5-icon {
    display: inline-block;
    vertical-align: middle;
    background-image: url("../assets/img/icon/bootstrap-5.png");
    background-size: 25px 25px;
    width: 25px;
    height: 25px;
}
#layui-icon {
    display: inline-block;
    vertical-align: middle;
    background-image: url("../assets/img/icon/layui.png");
    background-size: 25px 25px;
    background-repeat: no-repeat;
    width: 35px;
    height: 25px;
}
#idea {
    display: inline-block;
    background-image: url("../assets/img/icon/idea.png");
    border-radius: 50%;
    background-size: 64px 64px;
    height: 64px;
    width: 64px;
    vertical-align: middle;
}
#deployment {
    display: inline-block;
    background-image: url("../assets/img/icon/deployment.png");
    background-repeat: no-repeat;
    border-radius: 50%;
    background-size: 48px 48px;
    background-position: 8px 8px;
    height: 64px;
    width: 64px;
    vertical-align: middle;
}

.link-2 {
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
}
.link-2 > div {
    margin-top: 5px;
    margin-bottom: 5px;
}
.col-idea {
    flex-grow: 2;
}
.col-deployment {
    flex-grow: 3;
}
.link-1, .link-2, .link-3, .link-4, .link-5, .link-6 {
    border: 1px solid hsla(0, 0%, 100%, .2);
    transition: background-color, .2s;
    border-radius: 8px;
    /*background-color: #303033;*/
}
.link-1:hover {
    background: rgb(31, 187, 161) radial-gradient(circle at 200px 100px,
    rgb(117, 214, 75) 0, rgb(117, 214, 75, 0) calc(0% + 129px))
    no-repeat scroll 0 0 border-box;
    color: #151320;
}
.link-2:hover {
    background: rgb(38, 234, 152) radial-gradient(circle at 50px 50px,
    rgb(191, 194, 107) 0, rgb(117, 214, 75, 0) calc(0% + 129px)) no-repeat scroll 0 0 border-box;
    color: #151320;

}
.link-3:hover {
    background: rgb(50, 141, 92) radial-gradient(circle at 100px 100px,
    rgb(155, 86, 239) 0, rgb(117, 214, 75, 0) calc(0% + 129px))
    no-repeat scroll 0 0 border-box;
    color: #151320;

}
.link-4:hover {
    background: rgb(236, 194, 145) radial-gradient(circle at 280px 90px,
    rgb(232, 54, 129) 0, rgb(117, 214, 75, 0) calc(0% + 129px))
    no-repeat scroll 0 0 border-box;
    color: #151320;
}
.link-5:hover {
    background: rgb(175, 76, 127) radial-gradient(circle at 150px 100px,
    rgb(177, 100, 213) 0, rgb(117, 214, 75, 0) calc(0% + 129px))
    no-repeat scroll 0 0 border-box;
    color: #151320;
}
.link-6:hover {
    background: rgb(81, 176, 159) radial-gradient(circle at 150px 100px,
    rgb(204, 165, 114) 0, rgb(117, 214, 75, 0) calc(0% + 129px))
    no-repeat scroll 0 0 border-box;
    color: #151320;
}
</style>
