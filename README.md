# Web Scraper Chrome 扩展插件

一个的 Chrome 扩展插件，用于抓取网页内容并将其转换为 Markdown 格式保存到本地。

## 功能特点

- 🔍 单页内容抓取：一键抓取当前页面指定内容
- 📚 批量页面抓取：自动遍历多个页面并抓取内容
- 🎯 自定义内容选择：通过类名精确定位要抓取的内容
- ⚡ 即时转换：自动将HTML内容转换为Markdown格式
- 💾 本地保存：直接将抓取的内容保存到本地文件

## 安装说明

1. 下载本扩展的源代码
2. 打开 Chrome 浏览器，进入扩展管理页面（chrome://extensions/）
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择本扩展的源代码目录

## 使用指南

### 单页抓取

1. 点击扩展图标打开操作面板
2. 在「通用设置」中输入要抓取内容的元素类名（如：article-content）
3. 点击「抓取并保存为Markdown」按钮
4. 等待抓取完成，文件将自动下载到本地

### 批量抓取

1. 在操作面板中设置内容元素类名
2. 输入下一页按钮的类名（如：next-page）
3. 点击「抓取所有页面」按钮
4. 扩展会自动遍历所有页面并保存内容

## 技术实现

- 使用 Chrome Extension Manifest V3
- 集成 Turndown.js 实现 HTML 到 Markdown 的转换
- 采用 Content Scripts 实现页面内容抓取
- 使用 Background Service Worker 处理下载任务

## 文件结构

```
├── manifest.json     # 扩展配置文件
├── popup.html       # 扩展弹窗界面
├── popup.js         # 弹窗交互逻辑
├── content.js       # 内容抓取脚本
├── background.js    # 后台服务脚本
├── turndown.js      # HTML转Markdown库
└── icons/          # 扩展图标目录
    └── icon.svg     # 扩展图标
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。在提交代码前，请确保：

1. 代码符合项目的编码规范
2. 新功能有充分的测试
3. 更新相关文档

## 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。