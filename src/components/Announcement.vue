<template>
    <transition enter-active-class="transform transition-all duration-500 ease-out"
        enter-from-class="translate-y-full opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transform transition-all duration-300 ease-in"
        leave-from-class="translate-y-0 opacity-100 scale-100" leave-to-class="translate-y-full opacity-0 scale-95">
        <div v-if="isVisible" class="fixed left-4 top-4 w-72 z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-5 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                :class="{ 'animate-pulse-once': showPulseAnimation }">
                <!-- 装饰性元素 - 左上角圆形 -->
                <div class="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-blue-500 opacity-10"></div>
                <!-- 装饰性元素 - 右下角圆形 -->
                <div class="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-purple-500 opacity-10"></div>

                <div class="flex items-center justify-between relative z-10 p-4 -mt-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">公告</h3>
                    <button @click="close"
                        class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 cursor-pointer hover:rotate-180 hover:scale-105">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300">
                    本次更新了Qwen3系列模型的速度测试！以及全新的筛选侧边栏！
                </div>
                <!-- 进度条 -->
                <div v-if="autoCloseEnabled" class="absolute bottom-0 left-0 h-1 bg-blue-500"
                    :style="{ width: `${closeProgress}%` }"></div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
    autoCloseTime: {
        type: Number,
        default: 0 // 0表示不自动关闭，其他数值表示自动关闭的秒数
    }
});

const isVisible = ref(false)
const closeProgress = ref(0)
const autoCloseEnabled = computed(() => props.autoCloseTime > 0)
let autoCloseTimer = null
let progressInterval = null

const close = () => {
    isVisible.value = false
    clearTimers()
}



const clearTimers = () => {
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
    }
    if (progressInterval) {
        clearInterval(progressInterval)
    }
}

const setupAutoClose = () => {
    if (props.autoCloseTime > 0) {
        // 设置自动关闭定时器
        autoCloseTimer = setTimeout(() => {
            isVisible.value = false
        }, props.autoCloseTime * 1000)

        // 设置进度条更新
        const updateInterval = 50 // 每50ms更新一次进度条
        const totalUpdates = props.autoCloseTime * 1000 / updateInterval
        const increment = 100 / totalUpdates

        progressInterval = setInterval(() => {
            closeProgress.value += increment
            if (closeProgress.value >= 100) {
                clearInterval(progressInterval)
            }
        }, updateInterval)
    }
}

// 监听可见性变化，重置进度条
watch(isVisible, (newValue) => {
    if (newValue) {
        closeProgress.value = 0
        setupAutoClose()
    } else {
        clearTimers()
    }
})

onMounted(() => {
    const hasClosedBefore = localStorage.getItem('announcement-closed')
    if (!hasClosedBefore) {
        // 延迟显示公告，给页面加载一些时间
        setTimeout(() => {
            isVisible.value = true
        }, 1000)
    }
})

// 导出方法供外部调用
defineExpose({
    show: () => {
        isVisible.value = true
    },
    close
})
</script>

<style scoped>
.animate-pulse-once {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1);
}
</style>