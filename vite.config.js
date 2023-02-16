/// <reference types="vitest"/>

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/vuebms/',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	test: {},
	// 引入第三方配置
	optimizeDeps: {
		include: ["axios"]
	},
	// 配置跨域请求
	server: {
		hmr: true,
		// port: '3000',
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8000/api',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
})
