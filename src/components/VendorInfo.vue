<template>
    <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="vendor in vendors" :key="vendor.id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <div class="p-4 h-54">
                    <div class="flex items-center mb-3">
                        <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ vendor.name }}</span>
                        <span class="ml-2 px-2 py-1 text-xs rounded-full" :class="{
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': vendor.type === '完全免费',
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': vendor.type === '限量免费',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': vendor.type === '限时免费',
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': vendor.type === '稳定性无保障'
                        }">
                            {{ vendor.type }}
                        </span>
                    </div>

                    <div class="mb-3 min-h-10">
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ vendor.description }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400" v-if="vendor.limit">
                            限制: {{ vendor.limit }}
                        </p>
                    </div>

                    <div class="mb-3">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">支持模型:</h3>
                        <div class="flex flex-wrap gap-1">
                            <span v-for="model in vendor.models" :key="model"
                                class="px-1.5 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                {{ model }}
                            </span>
                        </div>
                    </div>

                    <a :href="vendor.link" target="_blank"
                        class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm">
                        访问网站
                        <svg class="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            vendors: [
                {
                    id: 1,
                    name: '硅基流动',
                    type: '完全免费',
                    description: '有许多的免费小模型',
                    models: ['智谱 AI', 'Deepseek', 'Qwen'],
                    link: 'https://cloud.siliconflow.cn/'
                },
                {
                    id: 2,
                    name: 'BigModel',
                    type: '完全免费',
                    description: '提供智谱自家的免费小模型',
                    limit: '每日100次请求',
                    models: ['智谱 AI'],
                    link: 'https://www.bigmodel.cn/'
                },
                {
                    id: 3,
                    name: '算了吗API（freeQwQ）',
                    type: '稳定性无保障',
                    description: '服务由来自广大网友共享的闲时设备提供算力支持',
                    limit: '不太稳定',
                    models: ['Qwen'],
                    link: 'https://qwq.aigpu.cn/'
                },
                {
                    id: 4,
                    name: '讯飞星火',
                    type: '完全免费',
                    description: '提供自家的免费小模型',
                    models: ['Spark'],
                    link: 'https://xinghuo.xfyun.cn/sparkapi'
                },
                {
                    id: 5,
                    name: 'Cloudflare',
                    type: '完全免费',
                    description: '免费使用Beta版模型',
                    models: ['Deepseek', 'Deepcoder', 'Openchat'],
                    link: 'https://dash.cloudflare.com/'
                },
                {
                    id: 6,
                    name: 'OpenRouter',
                    type: '限量免费',
                    description: '提供大量模型的免费服务',
                    limit: '每天50次请求',
                    models: ['微软', '谷歌', 'Zephyr'],
                    link: 'https://openrouter.ai/'
                },
                {
                    id: 7,
                    name: 'Pollinations',
                    type: '稳定性无保障',
                    description: '极度不稳定',
                    models: ['Llama', 'Deepseek', 'Qwen'],
                    link: 'https://pollinations.ai/'
                }
            ]
        }
    }
}
</script>

<style scoped>
/* 添加动画效果 */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}
</style>