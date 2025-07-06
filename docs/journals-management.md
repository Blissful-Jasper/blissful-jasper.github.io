# Journals 页面管理指南

## 概述

Journals 页面是一个学术期刊订阅和管理系统，支持 RSS 订阅、AI 智能总结、分类过滤等功能。所有期刊数据通过 `_data/journals.yml` 文件进行配置管理。

## 文件结构

```
├── journals.html                    # Journals 主页面
├── _data/
│   └── journals.yml                # 期刊数据配置文件
└── assets/
    ├── journals-rss-style.css     # Journals 页面样式
    └── journals-rss-handler.js    # RSS处理和AI总结功能
```

## 期刊配置

### 添加新期刊

在 `_data/journals.yml` 文件中添加新的期刊条目：

```yaml
journals:
  - name: "Nature"                    # 期刊简称
    fullname: "Nature"               # 期刊全名
    description: "International journal of science"  # 期刊描述
    rss_url: "https://www.nature.com/nature.rss"    # RSS订阅链接
    homepage: "https://www.nature.com/"              # 期刊主页
    impact_factor: 69.504            # 影响因子
    category: "multidisciplinary"    # 分类
    color: "#2c5aa0"                # 主题色
    icon: "fas fa-globe"            # 图标
    geoscience_relevance: "high"     # 地球科学相关度
```

### 支持的分类

- `multidisciplinary` - 综合性期刊
- `geoscience` - 地球科学
- `atmospheric` - 大气科学
- `climate` - 气候科学
- `geophysics` - 地球物理

### 字段说明

| 字段 | 必需 | 说明 |
|------|------|------|
| name | 是 | 期刊简称，用于显示 |
| fullname | 是 | 期刊全名 |
| description | 是 | 期刊描述 |
| rss_url | 是 | RSS订阅链接 |
| homepage | 是 | 期刊官方网站 |
| impact_factor | 否 | 影响因子 |
| category | 是 | 期刊分类 |
| color | 否 | 主题色（十六进制） |
| icon | 否 | FontAwesome 图标类名 |
| geoscience_relevance | 否 | 地球科学相关度（high/medium/low） |

## 功能特性

### 1. RSS 订阅功能

- 自动获取期刊最新文章
- 支持缓存机制，减少重复请求
- 错误处理和重试机制

### 2. AI 智能总结

- 自动识别地球科学相关内容
- 生成中文摘要和关键词
- 缓存总结结果，提高效率

### 3. 分类过滤

用户可以按以下类别过滤期刊：
- 全部
- 综合性
- 地球科学
- 大气科学
- 气候科学
- 地球物理

### 4. 实时更新

- 显示最后更新时间
- 手动刷新功能
- 自动检查新内容

## 技术实现

### RSS 处理

使用 `journals-rss-handler.js` 处理 RSS 订阅：

```javascript
// 获取RSS内容
const rssHandler = new JournalsRSSHandler();
const articles = await rssHandler.fetchRSSFeed(rssUrl);

// 生成AI摘要
const summary = await rssHandler.generateAISummary(title, description, journalName);
```

### 跨域解决方案

使用 `rss2json.com` 作为代理服务：
```javascript
this.corsProxy = 'https://api.rss2json.com/v1/api.json?rss_url=';
```

### 缓存机制

- RSS 数据缓存 1 小时
- AI 总结缓存 1 小时
- 使用 Map 对象进行内存缓存

## 样式自定义

### 主题配色

在 `journals-rss-style.css` 中自定义：

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --text-color: #333;
  --bg-color: #f8f9fa;
}
```

### 响应式设计

- 支持桌面端和移动端
- 自适应网格布局
- 优化的触摸交互

## 最佳实践

### 1. RSS URL 验证

添加新期刊前，请确认：
- RSS URL 有效且可访问
- 返回标准的 RSS/Atom 格式
- 支持 CORS 或可通过代理访问

### 2. 性能优化

- 定期清理缓存
- 控制同时请求的期刊数量
- 使用防抖函数避免频繁刷新

### 3. 内容筛选

配置 `geoscience_relevance` 字段：
- `high` - 核心地球科学期刊
- `medium` - 部分相关内容
- `low` - 偶尔相关内容

## 故障排除

### RSS 获取失败
1. 检查期刊 RSS URL 是否有效
2. 验证代理服务是否正常
3. 查看浏览器控制台错误信息

### AI 总结不工作
1. 确认 AI 服务配置正确
2. 检查 API 密钥和权限
3. 验证网络连接

### 样式显示异常
1. 检查 CSS 文件路径
2. 清除浏览器缓存
3. 验证 FontAwesome 图标库加载

### 分类过滤问题
1. 确认分类名称一致性
2. 检查 JavaScript 是否加载
3. 验证数据格式正确性

## 扩展功能

### 添加新的分类

1. 在 `journals.yml` 中定义新分类
2. 在 `journals.html` 中添加过滤按钮
3. 更新 JavaScript 过滤逻辑

### 自定义 AI 服务

修改 `journals-rss-handler.js` 中的 AI 接口：

```javascript
async generateAISummary(title, description, journalName) {
  // 自定义 AI API 调用
  const response = await fetch('your-ai-api-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, journal: journalName })
  });
  
  return await response.json();
}
```

### 数据导出功能

可以添加期刊数据的导出功能：
- 导出为 JSON 格式
- 生成期刊列表报告
- 创建订阅备份
