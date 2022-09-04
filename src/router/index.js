import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'index',
			component: () => import('../views/Index.vue')
		},
		{
			path: '/user/home',
			name: 'userHome',
			component: () => import ('../views/user/Home.vue')
		},
		{
			path: '/user/login',
			name: 'userLogin',
			component: () => import ('../views/user/Login.vue')
		},
		{
			path: '/user/register',
			name: 'userRegister',
			component: () => import ('../views/user/Register.vue')
		},
		{
			path: '/user/borrowDetail',
			name: 'borrowDetail',
			component: () => import ('../views/user/BorrowDetail.vue')
		},
		{
			path: '/user/profile',
			name: 'userProfile',
			component: () => import ('../views/user/Profile.vue')
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/About.vue')
		},
		{
			path: '/admin/login',
			name: 'adminLogin',
			component: () => import('../views/admin/Login.vue')
		},
		{
			path: '/admin/home',
			name: 'adminHome',
			component: () => import('../views/admin/Home.vue')
		},
		{
			path: '/admin/manage/book',
			name: 'BookManage',
			component: () => import('../views/admin/BookManage.vue')
		},
		{
			path: '/admin/manage/book/add',
			name: 'AddBook',
			component: () => import('../views/admin/AddBook.vue')
		},
		{
			path: '/admin/manage/book/modify',
			name: 'ModifyBook',
			component: () => import('../views/admin/ModifyBook.vue')
		},
	]
})

// 全局路由守卫 => 可以在这做一些权限控制
router.beforeEach((to, from, next) => {
	console.log('全局路由守卫')
	next()
})

export default router
