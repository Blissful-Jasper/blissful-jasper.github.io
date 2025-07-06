# 期刊配置调整日志

## 调整时间: 2025年7月2日

## 📋 调整说明

根据用户需求，对期刊配置进行了精准调整，保留更多海洋科学、大气科学相关内容，移除过于专业的地质学期刊。

## ➕ 新增期刊

### Science Advances
- **全名**: Science Advances
- **描述**: Multidisciplinary open access journal (含地球科学、海洋科学内容)
- **影响因子**: 14.957
- **分类**: multidisciplinary
- **地球科学相关性**: high
- **RSS**: `https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=sciadv`
- **理由**: 该期刊发表大量海洋科学、地球科学、大气科学领域的高质量研究

### Journal of the Atmospheric Sciences
- **全名**: Journal of the Atmospheric Sciences
- **描述**: American Meteorological Society (大气科学与地球科学)
- **影响因子**: 3.8
- **分类**: atmospheric
- **地球科学相关性**: high
- **RSS**: `https://journals.ametsoc.org/journalissuetocrss/journals/atsc/atsc-overview.xml`
- **理由**: 大气科学与地球科学、海洋科学密切相关，涉及气候变化、大气环流等重要议题

## ➖ 移除期刊

以下期刊因过于专业化或与海洋科学、大气科学关联度较低而移除：

### Earth and Planetary Science Letters
- **影响因子**: 5.3
- **移除理由**: 主要关注固体地球、行星科学，与海洋科学、大气科学关联度较低

### Geology
- **影响因子**: 5.8
- **移除理由**: 专注地质学研究，与海洋科学、大气科学交集较少

### Journal of Geophysical Research: Solid Earth
- **影响因子**: 4.0
- **移除理由**: 专注固体地球物理，与海洋、大气科学直接相关性较低

### Environmental Research Letters
- **影响因子**: 6.7
- **移除理由**: 虽然环境科学相关，但内容过于广泛，包含大量非地球科学内容

## 📊 调整后期刊列表

### 最终期刊配置（7个期刊）

#### 综合性期刊（3个）
1. **Nature** (IF: 69.5) - 含地球科学、海洋科学、大气科学领域
2. **Science** (IF: 63.7) - 含地球科学、海洋科学、大气科学领域  
3. **Science Advances** (IF: 14.957) - 含地球科学、海洋科学内容

#### 地球科学核心期刊（4个）
1. **Nature Climate Change** (IF: 30.7) - 气候科学（与海洋、大气密切相关）
2. **Reviews of Geophysics** (IF: 25.2) - 地球物理学综述
3. **Nature Geoscience** (IF: 18.3) - 地球与行星科学
4. **Geophysical Research Letters** (IF: 5.2) - 地球物理研究
5. **Journal of Climate** (IF: 5.3) - 气候研究与建模
6. **Journal of the Atmospheric Sciences** (IF: 3.8) - 大气科学

## 🏷️ 分类系统调整

### 保留的分类
- `all` - 全部期刊
- `multidisciplinary` - 综合性期刊
- `geoscience` - 地球科学
- `geophysics` - 地球物理
- `climate` - 气候科学
- `atmospheric` - 大气科学

### 移除的分类
- `geology` - 地质学
- `planetary` - 行星科学
- `solid_earth` - 固体地球
- `environmental` - 环境科学

## 🎯 期刊覆盖领域

调整后的期刊配置更好地覆盖了以下领域：

### 海洋科学相关
- **Nature** - 海洋生物学、海洋地质学、海洋物理学
- **Science** - 海洋环流、海洋化学、海洋生态系统
- **Science Advances** - 海洋科学创新研究
- **Nature Geoscience** - 海洋地球化学、古海洋学
- **Nature Climate Change** - 海洋与气候相互作用
- **Geophysical Research Letters** - 海洋地球物理学

### 大气科学相关
- **Journal of the Atmospheric Sciences** - 大气动力学、大气物理学
- **Journal of Climate** - 大气-海洋相互作用、气候建模
- **Nature Climate Change** - 大气化学、气候变化
- **Geophysical Research Letters** - 大气地球物理学
- **Nature** - 大气科学前沿研究
- **Science** - 大气科学创新发现

### 地球科学交叉领域
- **Reviews of Geophysics** - 地球系统科学综述
- **Nature Geoscience** - 地球系统相互作用
- **Science Advances** - 地球科学跨学科研究

## 🎨 UI界面更新

### 筛选按钮调整
- 移除了"地质学"、"行星科学"、"环境科学"筛选按钮
- 保留了"大气科学"筛选按钮
- 重新排列筛选按钮顺序，突出海洋-大气-地球科学相关性

### 样式优化
- 为大气科学分类添加了蓝色主题样式
- 移除了不再使用的分类样式代码
- 优化了地球科学期刊图标特效

## 📈 影响因子分布

### 超高影响因子 (>20)
- Nature (69.5)
- Science (63.7)  
- Nature Climate Change (30.7)
- Reviews of Geophysics (25.2)

### 高影响因子 (10-20)
- Science Advances (14.957)
- Nature Geoscience (18.3)

### 中等影响因子 (3-10)
- Journal of Climate (5.3)
- Geophysical Research Letters (5.2)
- Journal of the Atmospheric Sciences (3.8)

## 🔄 RSS源验证

所有期刊的RSS源均已验证可用：
- ✅ Nature RSS正常
- ✅ Science RSS正常
- ✅ Science Advances RSS正常
- ✅ Nature Geoscience RSS正常
- ✅ Nature Climate Change RSS正常
- ✅ Reviews of Geophysics RSS正常
- ✅ Geophysical Research Letters RSS正常
- ✅ Journal of Climate RSS正常
- ✅ Journal of the Atmospheric Sciences RSS正常

## 📝 后续建议

1. **内容过滤优化**: 可以为综合性期刊（Nature、Science、Science Advances）添加关键词过滤，优先显示海洋科学、大气科学、地球科学相关文章

2. **AI摘要改进**: 针对海洋科学、大气科学领域优化AI摘要生成，提高专业术语的准确性

3. **期刊扩展**: 未来可考虑添加更多海洋科学专业期刊，如：
   - Journal of Physical Oceanography
   - Deep Sea Research
   - Ocean Science
   - Atmospheric Chemistry and Physics

4. **分类细化**: 可以考虑添加更细粒度的分类，如：
   - 物理海洋学
   - 海洋地球化学
   - 大气动力学
   - 气候建模

## 相关文件
- `_data/journals.yml` - 期刊配置文件
- `_includes/journals-section.html` - 期刊界面模板
- `assets/journals-styles.css` - 期刊样式文件
- `JOURNAL_ADJUSTMENT_LOG.md` - 本调整日志
