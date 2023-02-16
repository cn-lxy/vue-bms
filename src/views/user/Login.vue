<template>
	<div id="container">
		<LoginCard />
	</div>
</template>

<script setup>
import LoginCard from '@/components/LoginCard.vue'
</script>

<style scoped>
@import '@/assets/css/init.css';

#container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background: #161623;
}

#container::before {
	content: '';
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(#f00, #f0f);
	clip-path: circle(30% at right 70%);
}

#container::after {
	content: '';
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(#2196f3, #e91e63);
	clip-path: circle(20% at 10% 10%);
}
</style>