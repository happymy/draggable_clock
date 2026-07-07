# 可拖拽时钟刷新 Chrome 扩展

一个可拖动的数字时钟，悬浮在页面上实时显示时间（含秒），点击即可执行硬刷新。

## 功能特性

- 🕐 数字时钟实时显示 `HH:MM:SS`
- 🎯 可随意拖拽到任意位置
- 🔄 点击时钟执行硬刷新（忽略缓存）
- 📱 支持桌面和移动设备
- 🔍 自动适配单页应用（MutationObserver）
- 💾 记忆时钟位置（localStorage 按域名隔离）

## 安装方法

1. 打开 Chrome → 进入 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"，选择 `draggable_clock` 目录

## 文件结构

```
manifest.json    # 扩展配置文件（Manifest V3）
content.js       # 内容脚本，实现时钟与拖拽逻辑
styles.css       # 时钟样式（毛玻璃药丸）
README.md        # 说明文档
```

## 使用方法

- **拖拽**：按住时钟并拖动到任意位置，松手后位置自动保存
- **刷新**：点击时钟执行硬刷新（追加 `_rb` 参数绕开缓存）

## 技术细节

- Manifest V3，纯前端实现，无需后台脚本
- `position: fixed` 固定定位，`z-index: 10000` 置顶
- CSS `touch-action: none` + `backdrop-filter` 毛玻璃效果
- 鼠标/触摸拖拽逻辑带视口边界约束
- `MutationObserver` 监听 DOM 变化，防止时钟被意外移除

## 注意事项

- 硬刷新会忽略浏览器缓存，重新加载所有资源
- 某些受限制页面（如 chrome://）无法注入内容脚本
