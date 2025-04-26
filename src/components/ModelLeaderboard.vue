<template>
  <div class="w-full max-w-screen-xl mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-100">
    <!-- 筛选区域 -->
    <div
      class="flex flex-col gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto scrollbar-hide md:overflow-visible md:flex-row">
      <!-- 供应商筛选 -->
      <div class="min-w-[200px] lg:w-1/5">
        <h3 class="text-sm font-medium text-gray-500 mb-2">供应商</h3>
        <select v-model="selectedProvider"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-100 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option :value="null">全部</option>
          <option v-for="provider in providers" :key="provider.name" :value="provider.name">
              {{ provider.name }}
          </option>
        </select>
      </div>

      <!-- 创建者筛选 -->
      <div class="w-full lg:w-3/5">
        <h3 class="text-sm font-medium text-gray-500 mb-2">创建者</h3>
        <div class="flex space-x-2 pb-2 overflow-x-auto creator-scroll scroll-snap-x mandatory">
          <button v-for="creator in creators" :key="creator.name" @click="toggleCreator(creator.name)"
            class="px-6 py-1 text-sm rounded-full whitespace-nowrap cursor-pointer flex items-center gap-1.5" :class="{
              'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-300': selectedCreators.includes(creator.name),
              'bg-gray-100 text-gray-800 hover:bg-blue-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700': !selectedCreators.includes(creator.name)
            }">
            <img v-if="creator.logo" :src="creator.logo"
              class="w-4 -ml-3 h-4 rounded-xl object-contain dark:brightness-150" />
            {{ creator.name }}
          </button>
        </div>
      </div>

      <!-- 排序选项 -->
      <div class="w-full lg:w-1/5">
        <h3 class="text-sm font-medium text-gray-500 mb-2">排序</h3>
        <select v-model="selectedSort"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-100 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
          <tr v-for="(model, index) in filteredModels" :key="model.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ index + 1 }}</td>
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
                <img 
                  v-if="creators.find(c => c.name === model.creator)?.logo"
                  :src="creators.find(c => c.name === model.creator)?.logo"
                  class="w-5 h-5 object-contain dark:brightness-150 md:w-6 md:h-6"
                />
                {{ model.name }}
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
            <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm text-gray-500 dark:text-gray-200">{{
              model.maxSpeed }}/{{ model.minSpeed }}</td>
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
</template>

<script>
export default {
  data() {
    return {
      selectedProvider: null,
      selectedCreators: [],
      selectedSort: 'avgSpeed',
      providers: [
        { name: '硅基流动', logo: 'https://cloud.siliconflow.cn/favicon.ico' },
        { name: 'BigModel', logo: 'https://www.bigmodel.cn/img/icons/favicon-32x32.png' },
        { name: 'Free-QWQ', logo: 'https://qwq.aigpu.cn/favicon.svg' },
        { name: '讯飞星火', logo: 'https://xinghuo.xfyun.cn/spark-icon.ico' },
        { name: 'Cloudflare', logo: 'https://www.cloudflare-cn.com/favicon.ico' },
        { name: 'OpenRouter', logo: 'https://openrouter.ai/favicon.ico' },
        { name: 'Chutes', logo: 'https://logos.chutes.ai/logos/24ef9084-7739-400c-aab6-135463a8c2d9.webp' },
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