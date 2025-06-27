<template>
  <div class="w-full max-w-screen-xl mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- 搜索框和收起/展开按钮 -->
      <div
        class="w-full md:w-64 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between">
        <div>
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="搜索模型名称..."
              class="w-full pl-3 pr-10 py-2 text-base bg-gray-100 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300">
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <button @click="toggleSidebar"
          class="mt-3 flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-all duration-300 transform hover:scale-105">
          <span>{{ sidebarCollapsed ? '展开筛选' : '收起筛选' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" :class="{ 'rotate-180': !sidebarCollapsed }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- 创建者筛选区域 (顶部) -->
      <div
        class="w-full md:w-3/4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300 mb-3">创建者</h3>
        <div class="flex space-x-2 pb-2 overflow-x-auto creator-scroll scroll-snap-x mandatory">
          <button v-for="creator in creators" :key="creator.name" @click="toggleCreator(creator.name)"
            class="px-6 py-1.5 text-sm rounded-full whitespace-nowrap cursor-pointer flex items-center gap-1.5 transition-all duration-300 transform hover:scale-105"
            :class="{
              'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800': selectedCreators.includes(creator.name),
              'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600': !selectedCreators.includes(creator.name)
            }">
            <img v-if="creator.logo" :src="creator.logo"
              class="w-4 h-4 -ml-4 rounded-xl object-contain dark:brightness-150" />
            {{ creator.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- 左侧筛选面板 -->
      <div v-if="!sidebarCollapsed"
        class="w-full md:w-64 md:sticky md:top-4 md:self-start md:max-h-screen md:overflow-auto space-y-4 pb-4 sidebar-panel transition-all duration-300">
        <!-- 统一的筛选面板 -->
        <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <!-- 供应商筛选 -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300 mb-3">供应商</h3>
            <select v-model="selectedProvider"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-100 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-300">
              <option :value="null">全部</option>
              <option v-for="provider in providers" :key="provider.name" :value="provider.name">
                {{ provider.name }}
              </option>
            </select>
          </div>

          <!-- 模型大小范围筛选 -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300 mb-3">模型大小范围 ({{ sizeRange[0] }}B - {{
              sizeRange[1] }}B)</h3>
            <div class="mt-2 px-1">
              <div class="relative">
                <input type="range" min="0" :max="maxModelSize" v-model.number="sizeRange[0]"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500 mb-3"
                  @input="validateSizeRange">
                <input type="range" min="0" :max="maxModelSize" v-model.number="sizeRange[1]"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                  @input="validateSizeRange">
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0B</span>
                  <span>{{ maxModelSize }}B</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 排序选项 -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-300 mb-3">排序方式</h3>
            <div class="space-y-2">
              <label
                class="block cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                <input type="radio" v-model="selectedSort" value="avgSpeed" class="mr-2 accent-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-200">平均输出速度</span>
              </label>
              <label
                class="block cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                <input type="radio" v-model="selectedSort" value="firstToken" class="mr-2 accent-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-200">平均首字</span>
              </label>
              <label
                class="block cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                <input type="radio" v-model="selectedSort" value="maxSpeed" class="mr-2 accent-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-200">最大速度</span>
              </label>
              <label
                class="block cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                <input type="radio" v-model="selectedSort" value="minSpeed" class="mr-2 accent-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-200">最小速度</span>
              </label>
              <label
                class="block cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                <input type="radio" v-model="selectedSort" value="size" class="mr-2 accent-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-200">模型大小</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div class="w-full transition-all ease-in-out duration-150"
        :class="{ 'md:w-3/4': !sidebarCollapsed, 'md:w-full': sidebarCollapsed }">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto transition-all duration-300 hover:shadow-md">
          <table class="min-w-full lg:min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  #</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  供应商</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  模型名</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  平均输出速度 (t/s)</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  最大/最小 (t/s)</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  平均首字</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(model, index) in filteredModels" :key="model.id"
                class="transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                  <div class="flex items-center gap-2">
                    <img v-if="providers.find(p => p.name === model.provider)?.logo"
                      :src="providers.find(p => p.name === model.provider)?.logo"
                      class="w-6 h-6 object-contain dark:brightness-150" />
                    {{ model.provider }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div class="flex items-center gap-2">
                    <img v-if="creators.find(c => c.name === model.creator)?.logo"
                      :src="creators.find(c => c.name === model.creator)?.logo"
                      class="w-5 h-5 object-contain dark:brightness-150 md:w-6 md:h-6" />
                    {{ model.name }}<div class="bg-blue-200 rounded-xl p-1 min-w-8 text-center">{{ model.size === 'XXX'
                      ? '未知' : `${model.size}B` }}</div>
                  </div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-200 relative">
                  <div class="mb-1">{{ model.avgSpeed }}</div>
                  <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-blue-400 to-blue-200 dark:from-blue-600 dark:to-blue-400 transition-all duration-500"
                      :style="{ width: `${((model.avgSpeed - currentMinAvgSpeed) / (currentMaxAvgSpeed - currentMinAvgSpeed)) * 90 + 10}%` }" />
                  </div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-200">
                  {{ model.maxSpeed }}/{{ model.minSpeed }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-200 relative">
                  <div class="mb-1">{{ model.firstToken }}ms</div>
                  <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-green-400 to-green-200 dark:from-green-600 dark:to-green-400 transition-all duration-500"
                      :style="{ width: `${((currentMaxFirstToken - model.firstToken) / (currentMaxFirstToken - currentMinFirstToken)) * 85 + 10}%` }" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
      searchQuery: '',
      sidebarCollapsed: false,
      sizeRange: [0, 100],  // 默认范围，最大值会在数据加载后更新
      maxModelSize: 100,    // 默认最大值，会在数据加载后更新
      providers: [
        { name: '硅基流动', logo: 'https://cloud.siliconflow.cn/favicon.ico' },
        { name: 'BigModel', logo: 'https://www.bigmodel.cn/img/icons/favicon-32x32.png' },
        { name: '算了吗API', logo: 'https://qwq.aigpu.cn/favicon.svg' },
        { name: '讯飞星火', logo: 'https://xinghuo.xfyun.cn/spark-icon.ico' },
        { name: 'Cloudflare', logo: 'https://www.cloudflare-cn.com/favicon.ico' },
        { name: 'OpenRouter', logo: 'https://openrouter.ai/favicon.ico' },
        { name: 'Pollinations', logo: 'https://pollinations.ai/favicon-32x32.png' }
      ],
      creators: [
        { name: '智谱 AI', logo: 'https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/Zhipu.svg' },
        { name: 'Deepseek', logo: 'https://cdn.rayonlabs.ai/chutes/logos/deepseek.webp' },
        { name: 'Qwen', logo: 'https://cdn.rayonlabs.ai/chutes/logos/qwen.webp' },
        { name: '科大讯飞', logo: 'https://cdn.rayonlabs.ai/chutes/logos/spark.webp' },
        { name: 'Llama', logo: 'https://cdn.rayonlabs.ai/chutes/logos/mvrck.webp' },
        { name: '月之暗面', logo: 'https://logos.chutes.ai/logos/8624e661-59f9-4f5e-930d-1dca0eb200d4.webp' },
        { name: 'Deepcoder', logo: 'https://deepcoder.org/favicon.ico' },
        { name: 'Openchat', logo: '' },
        { name: '微软', logo: 'https://cdn.rayonlabs.ai/chutes/logos/phi.webp' },
        { name: '谷歌', logo: '' },
        { name: 'internlm', logo: 'https://sf-maas-uat-prod.oss-cn-shanghai.aliyuncs.com/Model_LOGO/internlm.svg' },
        { name: 'Zephyr', logo: '' },
        { name: 'Hermes', logo: '' },
        { name: 'Falcon', logo: '' },
        { name: 'Mistral', logo: 'https://cdn.rayonlabs.ai/chutes/logos/mistral.webp' },
        { name: 'Sqlcoder', logo: '' },
        { name: 'Discolm', logo: '' },
        { name: 'UNA', logo: '' },
        { name: 'Neural', logo: '' },
        { name: 'Starling', logo: '' },
        { name: 'Shisa', logo: '' }
      ],
      models: []
    }
  },
  async created() {
    const response = await import('../data/models.json')
    this.models = response.default

    // 为每个模型添加随机大小（实际项目中应该从数据中获取）
    this.models.forEach(model => {
      if (!model.size) {
        // 生成7-70之间的随机数作为模型大小（单位：B）
        model.size = Math.floor(Math.random() * 63) + 7;
      }
    });

    // 更新最大模型大小
    this.updateMaxModelSize();
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

      // 按名称搜索
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase()
        models = models.filter(model =>
          model.name.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query) ||
          model.creator.toLowerCase().includes(query)
        )
      }

      // 按供应商筛选
      if (this.selectedProvider) {
        models = models.filter(model => model.provider === this.selectedProvider)
      }

      // 按创建者筛选
      if (this.selectedCreators.length > 0) {
        models = models.filter(model => this.selectedCreators.includes(model.creator))
      }

      // 按模型大小范围筛选
      models = models.filter(model =>
        model.size === 'XXX' || (parseFloat(model.size) >= this.sizeRange[0] && parseFloat(model.size) <= this.sizeRange[1])
      )

      // 排序
      if (this.selectedSort === 'avgSpeed') {
        models.sort((a, b) => b.avgSpeed - a.avgSpeed)
      } else if (this.selectedSort === 'firstToken') {
        models.sort((a, b) => a.firstToken - b.firstToken)
      } else if (this.selectedSort === 'maxSpeed') {
        models.sort((a, b) => b.maxSpeed - a.maxSpeed)
      } else if (this.selectedSort === 'minSpeed') {
        models.sort((a, b) => b.minSpeed - a.minSpeed)
      } else if (this.selectedSort === 'size') {
        models.sort((a, b) => {
          // 处理XXX值的排序
          if (a.size === 'XXX') return 1; // XXX值排在最后
          if (b.size === 'XXX') return -1;
          return parseFloat(b.size) - parseFloat(a.size);
        })
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
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    updateMaxModelSize() {
      // 找出所有模型中的最大尺寸
      if (this.models.length > 0) {
        // 过滤掉XXX值，只计算数字值的最大值
        const numericSizes = this.models
          .filter(m => m.size !== 'XXX')
          .map(m => parseFloat(m.size) || 0);

        this.maxModelSize = numericSizes.length > 0 ? Math.max(...numericSizes) : 100;
        // 更新范围的最大值
        this.sizeRange[1] = this.maxModelSize;
      }
    },
    validateSizeRange() {
      // 确保最小值不大于最大值
      if (this.sizeRange[0] > this.sizeRange[1]) {
        this.sizeRange[0] = this.sizeRange[1];
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

/* 添加动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* 侧边栏样式 */
.sidebar-panel {
  transition: all 0.3s ease;
}

.sidebar-panel:hover {
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .sidebar-panel {
    height: calc(100vh - 2rem);
    position: sticky;
    top: 1rem;
  }
}

/* 滑块样式优化 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: #2563eb;
}

.dark input[type="range"] {
  background: #4b5563;
}

.dark input[type="range"]::-webkit-slider-thumb {
  background: #3b82f6;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
}

.dark input[type="range"]::-webkit-slider-thumb:hover {
  background: #2563eb;
}
</style>