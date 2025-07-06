# 地球科学期刊配置更新日志

## 更新时间: 2025年7月2日

## 📊 期刊筛选优化

### 移除的期刊
为专注地球科学领域，移除了以下非地球科学期刊：
- ❌ Science Advances (综合性，但非地球科学专门)
- ❌ Science News (新闻类)
- ❌ Journal of the Atmospheric Sciences (大气科学，但与地球科学关联度较低)

### 保留的核心期刊

#### 综合性期刊（包含地球科学内容）
- ✅ **Nature** - 国际顶级科学期刊，经常发表重要地球科学研究
- ✅ **Science** - 美国科学促进会期刊，地球科学内容丰富

#### 地球科学专业期刊
- ✅ **Nature Geoscience** - 地球与行星科学顶级期刊
- ✅ **Geophysical Research Letters** - 地球物理研究快报
- ✅ **Reviews of Geophysics** - 地球物理学综述期刊
- ✅ **Nature Climate Change** - 气候科学顶级期刊
- ✅ **Journal of Climate** - 气候研究与建模

### 新增的地球科学期刊

#### 行星与地球科学
- ➕ **Earth and Planetary Science Letters** (IF: 5.3)
  - 涵盖地球和行星科学所有方面的通讯期刊
  - RSS: `https://www.sciencedirect.com/journal/earth-and-planetary-science-letters/rss`

#### 地质学
- ➕ **Geology** (IF: 5.8)
  - 美国地质学会首要期刊
  - RSS: `https://pubs.geoscienceworld.org/rss/geology/current.xml`

#### 固体地球
- ➕ **Journal of Geophysical Research: Solid Earth** (IF: 4.0)
  - 专注固体地球物理和化学研究
  - RSS: `https://agupubs.onlinelibrary.wiley.com/action/showFeed?jc=21699356&type=etoc&feed=rss`

#### 环境地球科学
- ➕ **Environmental Research Letters** (IF: 6.7)
  - 环境科学研究期刊，与地球科学高度相关
  - RSS: `https://iopscience.iop.org/journal/rss/1748-9326`

## 🏷️ 分类系统优化

### 新增分类标签
- `geology` - 地质学
- `planetary` - 行星科学  
- `solid_earth` - 固体地球
- `environmental` - 环境科学

### 地球科学相关性标识
为每个期刊添加了地球科学相关性标识：
- `core` - 核心地球科学期刊（绿色标识）
- `high` - 高相关性综合期刊（黄色标识）
- `medium` - 中等相关性（橙色标识）

## 🎨 UI界面更新

### 筛选按钮重组
按地球科学逻辑重新排列筛选按钮：
1. 全部期刊
2. 综合性 (Nature, Science等)
3. 地球科学 (Nature Geoscience等)
4. 地球物理 (GRL, RoG等)
5. 气候科学 (Nature Climate Change等)
6. 地质学 (Geology等)
7. 行星科学 (EPSL等)
8. 环境科学 (ERL等)

### 样式增强
- 为每个地球科学分类添加了专属颜色主题
- 增加了地球科学相关性标识显示
- 优化了地球科学期刊图标样式

## 📈 期刊统计

### 更新后期刊数量
- **总计**: 9个期刊
- **核心地球科学**: 7个期刊
- **高相关综合性**: 2个期刊

### 影响因子分布
- **超高影响因子 (>20)**: Nature (69.5), Science (63.7), Nature Climate Change (30.7), Reviews of Geophysics (25.2)
- **高影响因子 (5-20)**: Nature Geoscience (18.3), Environmental Research Letters (6.7), Geology (5.8), Journal of Climate (5.3), Earth and Planetary Science Letters (5.3), Geophysical Research Letters (5.2)
- **中等影响因子 (2-5)**: JGR: Solid Earth (4.0)

## 🔧 技术配置更新

### AI摘要配置
增加了地球科学专注配置：
```yaml
ai_summary:
  focus: "geoscience"  # 专注地球科学内容
```

### 显示配置
启用地球科学内容过滤：
```yaml
display:
  geoscience_filter: true  # 启用地球科学内容过滤
```

## 📝 后续优化建议

1. **内容过滤算法**: 开发AI算法自动识别综合性期刊中的地球科学相关文章
2. **关键词匹配**: 为RSS文章添加地球科学关键词匹配功能
3. **期刊扩展**: 考虑添加更多专业地球科学期刊
4. **个性化设置**: 允许用户自定义感兴趣的地球科学子领域

## 相关文件
- `_data/journals.yml` - 期刊配置文件
- `_includes/journals-section.html` - 期刊界面模板
- `assets/journals-styles.css` - 期刊样式文件
- `GEOSCIENCE_JOURNALS_UPDATE.md` - 本更新日志
