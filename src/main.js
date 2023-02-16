import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'
import { createPinia } from "pinia"

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$http = axios

// 全局属性
app.config.globalProperties.$user = {
    id: -1,
    name: 'null',
    updateUser: function() {
        this.id = localStorage.getItem('uid') * 1
        this.name = localStorage.getItem('name')
    }
}

app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.use(pinia)

app.mount('#app')
