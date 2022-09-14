<template>
    <div class="dialog" :class="{ 'is-show': visible }" :style="display ? 'display: none' : ''">
        <!-- 不透明遮罩 -->
        <div class="dialog-modal" @click.self="closeDialog"></div>
        <!-- 主体 -->
        <div class="dialog-main">
            <div class="dialog-head">
                <button class="button icon-button" @click="closeDialog">x</button>
            </div>
            <!-- 内容区 -->
            <div class="dialog-body">
                <!-- todo: vue-插槽 -->
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
    modelValue: Boolean
})
const emits = defineEmits(['update:modelValue'])
const visible = ref(props.modelValue)
const display = ref(true)
let timer = 0

// 关闭弹窗
const closeDialog = () => {
    clearTimeout(timer)
    visible.value = false
    timer = setTimeout(() => {
        display.value = false
        clearTimeout(timer)
    }, 300)
}

watch(() => props.modelValue, (currentValue) => {
    if (currentValue) {
        clearTimeout(timer)
        display.value = false
        timer = setTimeout(() => {
            visible.value = currentValue
            clearTimeout(timer)
        }, 20)
    } else {
        closeDialog()
    }
})
watch(() => visible.value, (currentValue) => {
    if (!currentValue) {
        emits('update:modelValue', currentValue)
    }
})

onBeforeUnmount(() => {
    clearTimeout(timer)
})
</script>

<style lang="less" scoped>
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    opacity: 0;
    transition: 0.3s;

    &.is-show {
        visibility: visible;
        opacity: 1;

        .dialog-main {
            transform: translateY(0);
        }
    }

    .dialog-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .dialog-main {
        transition: 0.3s;
        min-width: 500px;
        min-height: 100px;
        background-color: #22212c;
        border: 1px solid #454158;
        border-radius: .5rem;
        margin-bottom: 1.5rem;
        padding: .5rem;
        position: relative;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
        transform: translateY(10%);

        button {
            width: 28px;
            height: 28px;
            background-color: #8aff80;
            color: #151320;
            border-radius: 5px;
            border: 0px;
            // &:hover {
            //     background-color: #9580ff;
            // }
        }

        .icon-button {
            font-weight: 550;
            &:hover {
                background-color: #fc1f32;
            }
        }
    }

    .dialog-head {
        text-align: right;
    }

    .dialog-body {
        text-align: center;
        margin-bottom: 1.5rem;
        padding: .5rem;
    }
}

@media screen and (max-width: 768px) {
    .dialog {
        flex-direction: column;
        justify-content: flex-end;

        .dialog-main {
            min-width: unset;
            width: 100%;
            border-radius: 20px 20px 0 0;
        }
    }
}
</style>