# Free-LLMSpeed

## 项目介绍
Free-LLMSpeed 是一个用于比较不同免费大语言模型响应速度的Web应用。通过可视化展示各模型的平均速度、最大/最小速度以及首token时间，帮助用户选择最适合自己需求的模型。

## 功能特点
- 展示多个大语言模型的性能数据
- 可视化比较模型响应速度
- 提供详细的速度指标（平均速度、最大/最小速度）
- 显示首token响应时间
- 支持按提供商(硅基流动、BigModel等)、创建者(智谱AI、Deepseek等)筛选模型

## 安装指南
1. 确保已安装Node.js (v16+) 和 pnpm
2. 克隆仓库
```bash
git clone https://github.com/mc506lw/free-llmspeed.git
```
3. 安装依赖
```bash
cd free-llmspeed
pnpm install
```

## 使用说明
1. 启动开发服务器
```bash
pnpm dev
```
2. 打开浏览器访问 http://localhost:5173
3. 在界面中查看和比较不同模型的性能数据

## 贡献指南
欢迎提交Pull Request来改进项目。请确保：
- 代码符合现有风格
- 提交前运行测试
- 更新相关文档

## 数据来源
模型数据来自本地测试结果，包含以下提供商：
- 硅基流动
- BigModel
- Free-QWQ
- 讯飞星火
- OpenRouter