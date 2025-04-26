<template>
  <div class="w-full max-w-screen-xl mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
    <!-- 筛选区域 -->
    <div class="flex flex-col gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto scrollbar-hide md:overflow-visible md:flex-row">
      <!-- 供应商筛选 -->
      <div class="min-w-[200px] lg:w-1/5">
        <h3 class="text-sm font-medium text-gray-500 mb-2">供应商</h3>
        <select 
          v-model="selectedProvider" 
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-100 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option :value="null">全部</option>
          <option v-for="provider in providers" :key="provider" :value="provider">{{ provider }}</option>
        </select>
      </div>

      <!-- 创建者筛选 -->
      <div class="w-full lg:w-3/5">
        <h3 class="text-sm font-medium text-gray-500 mb-2">创建者</h3>
        <div class="flex space-x-2 pb-2 overflow-x-auto creator-scroll scroll-snap-x mandatory">
          <button 
            v-for="creator in creators" 
            :key="creator" 
            @click="toggleCreator(creator)"
            class="px-3 py-1 text-sm rounded-full whitespace-nowrap cursor-pointer"
            :class="{
              'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-300': selectedCreators.includes(creator),
              'bg-gray-100 text-gray-800 hover:bg-blue-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700': !selectedCreators.includes(creator)
            }"
          >
            {{ creator }}
          </button>
        </div>
      </div>

      <!-- 排序选项 -->
      <div class="w-full lg:w-1/5">
        <h3 class="text-sm font-medium text-gray-500 mb-2">排序</h3>
        <select 
          v-model="selectedSort" 
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-100 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="avgSpeed">平均输出速度</option>
          <option value="firstToken">平均首字</option>
        </select>
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto">
      <table class="min-w-[1024px] lg:min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">#</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">供应商</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">模型名</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">平均输出速度 (t/s)</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">最大/最小 (t/s)</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">平均首字</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="(model, index) in filteredModels" :key="model.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ model.provider }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ model.name }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-200 relative">
              <div class="mb-1">{{ model.avgSpeed }}</div>
              <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-400 transition-all duration-500"
                  :style="{ width: `${((model.avgSpeed - currentMinAvgSpeed) / (currentMaxAvgSpeed - currentMinAvgSpeed)) * 90 + 10}%` }"
                />
              </div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-200">{{ model.maxSpeed }}/{{ model.minSpeed }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-200 relative">
              <div class="mb-1">{{ model.firstToken }}ms</div>
              <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-green-400 to-green-200 dark:from-green-600 dark:to-green-400 transition-all duration-500"
                  :style="{ width: `${((currentMaxFirstToken - model.firstToken) / (currentMaxFirstToken - currentMinFirstToken)) * 85 + 10}%` }"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedProvider: null,
      selectedCreators: [],
      selectedSort: 'avgSpeed',
      providers: ['硅基流动', 'BigModel', 'Free-QWQ', '讯飞星火', 'Cloudflare', 'OpenRouter', 'Chutes', 'Pollinations'],
      creators: ['智谱 AI', 'Deepseek', 'Qwen', '科大讯飞', 'Llama', 'Deepcoder', 'Openchat', '微软', '谷歌', 'Zephyr', 'Hermes', 'Falcon', 'Mistral', 'Sqlcoder', 'Discolm', 'UNA', 'Neural', 'Starling', 'Shisa'],
      models: []
    }
  },
  async created() {
    const response = await import('../data/models.json')
    this.models = response.default
  },
  computed: {
    currentMaxAvgSpeed() {
      return Math.max(...this.filteredModels.map(m => m.avgSpeed));
    },
    currentMinAvgSpeed() {
      return Math.min(...this.filteredModels.map(m => m.avgSpeed));
    },
    currentMaxFirstToken() {
      return Math.max(...this.filteredModels.map(m => m.firstToken));
    },
    currentMinFirstToken() {
      return Math.min(...this.filteredModels.map(m => m.firstToken));
    },
    filteredModels() {
      let models = this.models
      
      // 按供应商筛选
      if (this.selectedProvider) {
        models = models.filter(model => model.provider === this.selectedProvider)
      }
      
      // 按创建者筛选
      if (this.selectedCreators.length > 0) {
        models = models.filter(model => this.selectedCreators.includes(model.creator))
      }
      
      // 排序
      if (this.selectedSort === 'avgSpeed') {
        models.sort((a, b) => b.avgSpeed - a.avgSpeed)
      } else {
        models.sort((a, b) => a.firstToken - b.firstToken)
      }
      
      return models
    }
  },
  methods: {
    toggleCreator(creator) {
      const index = this.selectedCreators.indexOf(creator)
      if (index === -1) {
        this.selectedCreators.push(creator)
      } else {
        this.selectedCreators.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
/* Apple风格样式 */
.container {
  max-width: 1200px;
}

/* 表格行悬停效果 */
tbody tr:hover {
  background-color: rgba(0, 122, 255, 0.05);
}

/* 暗黑模式表格行悬停效果 */
.dark tbody tr:hover {
  background-color: rgba(29, 78, 216, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  thead th {
    font-size: 0.75rem;
    padding: 0.75rem 0.5rem;
  }
}

.creator-scroll {
  scroll-snap-type: x mandatory;
  scroll-padding: 0 1rem;
}

.creator-scroll button {
  scroll-snap-align: start;
}

/* 移动端滚动条优化 */
.creator-scroll::-webkit-scrollbar {
  height: 6px;
}

.creator-scroll::-webkit-scrollbar-thumb {
  background-color: rgb(38, 100, 194);
  border-radius: 2px;
  cursor: pointer;
}

.creator-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(10, 59, 145);
}

.dark .creator-scroll::-webkit-scrollbar-thumb {
  background-color: rgb(38, 100, 194);
  border-radius: 2px;
  cursor: pointer;
}

.dark .creator-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(10, 59, 145);
}

.creator-scroll::-webkit-scrollbar-track {
  background-color: rgb(156, 163, 175);
}

.dark .creator-scroll::-webkit-scrollbar-track {
  background-color: rgb(65, 72, 81);
}
.progress-bar {
  transition: width 0.5s ease-in-out;
}
</style>