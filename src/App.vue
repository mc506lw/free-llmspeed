<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center flex-1">
            <span class="h-8 w-16 mr-4 text-2xl font-semibold text-gray-900 dark:text-white">[白嫖]</span>
            <a class="text-xl font-semibold text-gray-900 dark:text-white max-md:hidden" href="#">免费大模型速度排行榜</a>
            <!-- 桌面导航 -->
            <div class="hidden md:flex space-x-4 ml-8">
              <router-link to="/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">模型速度比较</router-link>
              <router-link to="/vendors" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">供应商信息</router-link>
            </div>
          </div>
          
          <!-- 移动端汉堡菜单 -->
          <div class="md:hidden flex items-center">
            <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg class="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          <!-- 移动端下拉菜单 -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="isMenuOpen" class="absolute md:hidden top-16 inset-x-0 mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700" @click.self="isMenuOpen = false">
              <div class="px-4 py-3 space-y-2">
                <router-link to="/" class="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">模型速度比较</router-link>
                <router-link to="/vendors" class="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">供应商信息</router-link>
              </div>
            </div>
          </transition>
          
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex space-x-2 text-sm">
              <span class="dark:text-gray-200">总访问<span id="busuanzi_value_site_pv" class="font-medium"></span>次</span>
            </div>
            <button @click="toggleDarkMode" class="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
    <footer class="fixed bottom-0 w-screen py-4 text-center">
      <div class="flex justify-center space-x-4 ">
        <div class="w-72 bg-gray-200 dark:bg-gray-700 rounded-2xl">
          <a class="text-sm dark:text-gray-100" href="https://github.com/mc506lw/free-llmspeed">© 2025 白嫖大模型速度排行榜  By:</a><a class="dark:text-gray-200" href="https://github.com/mc506lw">mc506lw</a></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import ModelLeaderboard from './components/ModelLeaderboard.vue'
import { ref, onMounted } from 'vue'

const isDark = ref(false)
const isMenuOpen = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  
  
})
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
</style>