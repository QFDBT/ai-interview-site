# AI 用户访谈专员网站（智能避障逗猫球项目）

宠物玩具项目"AI 用户访谈专员建立及实践"的成果展示网站：研究目标、适合人群、AI 提示词（一键复制）、访谈大纲合理性审查、数据后台模板，并内置本地模拟访谈演示。

纯静态 HTML/CSS/JS，**无需安装依赖、无需构建**，克隆或上传后即可直接访问。

## 快速开始

### 环境要求

- 任意现代浏览器（Chrome / Edge / Safari）
- 本地预览可选：Python 3 或任意静态服务器（直接双击 index.html 也能打开）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/<你的用户名>/ai-interview-agent.git
cd ai-interview-agent

# 本地预览（可选）
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

### 部署到 GitHub Pages

1. 在 GitHub 新建仓库，将本目录所有文件上传（或 `git push`）
2. 仓库 Settings → Pages → Source 选择 `main` 分支、`/(root)` 目录 → Save
3. 1–2 分钟后访问 `https://<你的用户名>.github.io/ai-interview-agent/`

## 目录结构

```
/
├── index.html      首页（产品速览 + 模块导航）
├── research.html   研究目标与适合人群
├── prompt.html     AI 访谈专员提示词 + 模拟访谈演示
├── review.html     访谈大纲合理性审查表与通过标准
├── data.html       数据后台字段模板与流转机制
├── css/style.css   全局样式（含响应式）
└── js/main.js      复制按钮、模拟访谈脚本、移动端导航
```

## 技术栈

- 原生 HTML5 / CSS3（CSS 变量 design token，响应式布局）
- 原生 JavaScript（无框架、无外部依赖）
- GitHub Pages 静态托管

## 线上地址

https://3219231694-dev.github.io/ai-interview-agent/
