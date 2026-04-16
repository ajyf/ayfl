# 阿黛尔的梦源之地  
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 

使用 [Astro](https://astro.build) 和 [fuwari](https://github.com/saicaca/fuwari) 构建。


## ✨ 特性

- [x] 使用 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 构建
- [x] 流畅的动画和页面过渡
- [x] 浅色 / 深色模式
- [x] 可自定义主题颜色和横幅
- [x] 响应式设计
- [x] 基于 RSS 的搜索功能
- [x] [Markdown 扩展功能](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] 文章目录
- [x] RSS 订阅

## ⚡ 命令

所有命令都在项目根目录中运行，从终端执行：

| 命令                       | 操作                                               |
|:---------------------------|:---------------------------------------------------|
| `pnpm install`             | 安装依赖                                           |
| `pnpm dev`                 | 在 `localhost:4321` 启动本地开发服务器             |
| `pnpm build`               | 构建生产版本到 `./dist/` 目录                      |
| `pnpm preview`             | 部署前在本地预览构建结果                           |
| `pnpm check`               | 检查代码中的错误                                   |
| `pnpm format`              | 使用 Biome 格式化代码                              |
| `pnpm new-post <filename>` | 创建新文章                                         |
| `pnpm astro ...`           | 运行 CLI 命令，如 `astro add`, `astro check`       |
| `pnpm astro --help`        | 获取 Astro CLI 使用帮助                            |
