---
layout: post
title: "Python绘图：在地图上添加小地图"
date: 2024-01-01
categories: [技术, 绘图]
tags: [Python, 地图, 可视化, cartopy]
---

# Python绘图：在地图上添加小地图

在科学研究中，我们经常需要在大范围的地图上添加小地图来突出显示研究区域。本文将介绍如何使用Python的cartopy和matplotlib库来实现这一功能。

## 基本概念

### 什么是小地图（Inset Map）

小地图是一个嵌入在主地图中的小型地图，通常用于：

- **显示研究区域位置**：在大范围地图中标出具体研究区域
- **提供地理背景**：为读者提供地理位置的参考
- **增强地图可读性**：帮助读者更好地理解空间关系

### 应用场景

- **科学论文**：在研究区域图中添加位置示意图
- **数据报告**：在区域分析图中提供全局视角
- **演示文稿**：增强地图的表达效果

## 技术准备

### 所需库

```python
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
import numpy as np
from cartopy.mpl.gridliner import LONGITUDE_FORMATTER, LATITUDE_FORMATTER
import matplotlib.patches as patches
from matplotlib.patches import Rectangle
import cartopy.io.shapereader as shpreader
```

### 安装依赖

```bash
pip install matplotlib cartopy numpy
# 如果需要额外的地图数据
pip install cartopy[plotting]
```

## 基础实现

### 1. 简单的小地图示例

```python
def create_basic_inset_map():
    """
    创建基础的小地图示例
    """
    # 创建主图
    fig = plt.figure(figsize=(12, 8))
    
    # 主地图 - 中国东部区域
    ax_main = fig.add_subplot(111, projection=ccrs.PlateCarree())
    ax_main.set_extent([105, 125, 25, 45], ccrs.PlateCarree())
    
    # 添加地图特征
    ax_main.add_feature(cfeature.COASTLINE, linewidth=0.8)
    ax_main.add_feature(cfeature.BORDERS, linewidth=0.6)
    ax_main.add_feature(cfeature.RIVERS, alpha=0.6)
    ax_main.add_feature(cfeature.LAKES, alpha=0.6)
    
    # 添加网格
    gl = ax_main.gridlines(draw_labels=True, alpha=0.5)
    gl.top_labels = False
    gl.right_labels = False
    gl.xformatter = LONGITUDE_FORMATTER
    gl.yformatter = LATITUDE_FORMATTER
    
    # 创建小地图 - 显示整个中国
    ax_inset = fig.add_axes([0.02, 0.65, 0.3, 0.3], 
                           projection=ccrs.PlateCarree())
    ax_inset.set_extent([70, 140, 10, 55], ccrs.PlateCarree())
    
    # 添加小地图特征
    ax_inset.add_feature(cfeature.COASTLINE, linewidth=0.5)
    ax_inset.add_feature(cfeature.BORDERS, linewidth=0.4)
    ax_inset.add_feature(cfeature.LAND, color='lightgray', alpha=0.5)
    ax_inset.add_feature(cfeature.OCEAN, color='lightblue', alpha=0.3)
    
    # 在小地图上标出主地图的范围
    rect = patches.Rectangle((105, 25), 20, 20, 
                           linewidth=2, edgecolor='red', 
                           facecolor='none', transform=ccrs.PlateCarree())
    ax_inset.add_patch(rect)
    
    # 添加标题
    ax_main.set_title('中国东部地区详细地图', fontsize=14, pad=20)
    
    plt.tight_layout()
    return fig, ax_main, ax_inset

# 创建地图
fig, ax_main, ax_inset = create_basic_inset_map()
plt.show()
```

### 2. 高级小地图功能

```python
class InsetMapCreator:
    """
    小地图创建器类
    """
    
    def __init__(self, figsize=(12, 10)):
        self.fig = plt.figure(figsize=figsize)
        self.ax_main = None
        self.ax_inset = None
        
    def create_main_map(self, extent, projection=ccrs.PlateCarree()):
        """
        创建主地图
        
        Parameters:
        -----------
        extent : list
            地图范围 [lon_min, lon_max, lat_min, lat_max]
        projection : cartopy projection
            地图投影
        """
        self.ax_main = self.fig.add_subplot(111, projection=projection)
        self.ax_main.set_extent(extent, ccrs.PlateCarree())
        
        # 添加基本地图特征
        self.ax_main.add_feature(cfeature.COASTLINE, linewidth=1.0)
        self.ax_main.add_feature(cfeature.BORDERS, linewidth=0.8)
        self.ax_main.add_feature(cfeature.RIVERS, alpha=0.6)
        self.ax_main.add_feature(cfeature.LAKES, alpha=0.6)
        self.ax_main.add_feature(cfeature.LAND, color='lightgray', alpha=0.3)
        self.ax_main.add_feature(cfeature.OCEAN, color='lightblue', alpha=0.3)
        
        return self.ax_main
    
    def add_inset_map(self, position, inset_extent, 
                     main_extent=None, projection=ccrs.PlateCarree()):
        """
        添加小地图
        
        Parameters:
        -----------
        position : list
            小地图位置 [x, y, width, height] (相对坐标)
        inset_extent : list
            小地图显示范围
        main_extent : list
            主地图范围（用于在小地图上标注）
        projection : cartopy projection
            小地图投影
        """
        self.ax_inset = self.fig.add_axes(position, projection=projection)
        self.ax_inset.set_extent(inset_extent, ccrs.PlateCarree())
        
        # 添加小地图特征
        self.ax_inset.add_feature(cfeature.COASTLINE, linewidth=0.5)
        self.ax_inset.add_feature(cfeature.BORDERS, linewidth=0.4)
        self.ax_inset.add_feature(cfeature.LAND, color='lightgray', alpha=0.5)
        self.ax_inset.add_feature(cfeature.OCEAN, color='lightblue', alpha=0.3)
        
        # 标注主地图范围
        if main_extent:
            lon_min, lon_max, lat_min, lat_max = main_extent
            rect = patches.Rectangle((lon_min, lat_min), 
                                   lon_max - lon_min, 
                                   lat_max - lat_min,
                                   linewidth=2, edgecolor='red', 
                                   facecolor='red', alpha=0.3,
                                   transform=ccrs.PlateCarree())
            self.ax_inset.add_patch(rect)
        
        return self.ax_inset
    
    def add_gridlines(self, ax, **kwargs):
        """
        添加网格线
        """
        gl = ax.gridlines(draw_labels=True, alpha=0.5, **kwargs)
        gl.top_labels = False
        gl.right_labels = False
        gl.xformatter = LONGITUDE_FORMATTER
        gl.yformatter = LATITUDE_FORMATTER
        return gl
```

## 实际应用示例

### 示例1：上海及周边地区

```python
def create_shanghai_map():
    """
    创建上海及周边地区地图，带小地图显示位置
    """
    creator = InsetMapCreator(figsize=(14, 10))
    
    # 主地图：上海及周边详细地图
    main_extent = [120, 122.5, 30.5, 32]
    ax_main = creator.create_main_map(main_extent)
    
    # 添加网格
    creator.add_gridlines(ax_main)
    
    # 添加数据点（示例）
    shanghai_lon, shanghai_lat = 121.47, 31.23
    ax_main.plot(shanghai_lon, shanghai_lat, 'ro', markersize=8, 
                transform=ccrs.PlateCarree(), label='上海市中心')
    
    # 小地图：显示在中国的位置
    inset_extent = [70, 140, 10, 55]
    ax_inset = creator.add_inset_map([0.02, 0.65, 0.3, 0.3], 
                                   inset_extent, main_extent)
    
    # 添加标题和标签
    ax_main.set_title('上海及周边地区详细地图', fontsize=16, pad=20)
    ax_main.legend(loc='upper right')
    
    return creator.fig

# 创建地图
fig = create_shanghai_map()
plt.show()
```

### 示例2：多个小地图

```python
def create_multi_inset_map():
    """
    创建包含多个小地图的复合地图
    """
    fig = plt.figure(figsize=(16, 12))
    
    # 主地图：中国东部
    ax_main = fig.add_subplot(2, 2, (1, 3), projection=ccrs.PlateCarree())
    ax_main.set_extent([105, 125, 25, 45], ccrs.PlateCarree())
    
    # 添加主地图特征
    ax_main.add_feature(cfeature.COASTLINE, linewidth=1.0)
    ax_main.add_feature(cfeature.BORDERS, linewidth=0.8)
    ax_main.add_feature(cfeature.LAND, color='lightgray', alpha=0.3)
    ax_main.add_feature(cfeature.OCEAN, color='lightblue', alpha=0.3)
    
    # 小地图1：北京周边
    ax_beijing = fig.add_subplot(2, 2, 2, projection=ccrs.PlateCarree())
    ax_beijing.set_extent([115, 118, 39, 41], ccrs.PlateCarree())
    ax_beijing.add_feature(cfeature.COASTLINE, linewidth=0.5)
    ax_beijing.add_feature(cfeature.BORDERS, linewidth=0.4)
    ax_beijing.set_title('北京地区')
    
    # 小地图2：上海周边
    ax_shanghai = fig.add_subplot(2, 2, 4, projection=ccrs.PlateCarree())
    ax_shanghai.set_extent([120, 122.5, 30.5, 32], ccrs.PlateCarree())
    ax_shanghai.add_feature(cfeature.COASTLINE, linewidth=0.5)
    ax_shanghai.add_feature(cfeature.BORDERS, linewidth=0.4)
    ax_shanghai.set_title('上海地区')
    
    # 在主地图上标注两个区域
    # 北京区域
    rect_beijing = patches.Rectangle((115, 39), 3, 2, 
                                   linewidth=2, edgecolor='blue', 
                                   facecolor='blue', alpha=0.3,
                                   transform=ccrs.PlateCarree())
    ax_main.add_patch(rect_beijing)
    
    # 上海区域
    rect_shanghai = patches.Rectangle((120, 30.5), 2.5, 1.5, 
                                    linewidth=2, edgecolor='red', 
                                    facecolor='red', alpha=0.3,
                                    transform=ccrs.PlateCarree())
    ax_main.add_patch(rect_shanghai)
    
    ax_main.set_title('中国东部地区及重点城市', fontsize=16, pad=20)
    
    plt.tight_layout()
    return fig

# 创建多小地图
fig = create_multi_inset_map()
plt.show()
```

## 高级技巧

### 1. 连接线

```python
def add_connection_lines(fig, ax_main, ax_inset, main_extent):
    """
    在主地图和小地图之间添加连接线
    """
    from matplotlib.patches import ConnectionPatch
    
    # 计算连接点
    lon_min, lon_max, lat_min, lat_max = main_extent
    
    # 主地图上的点
    x1, y1 = ax_main.projection.transform_point(lon_min, lat_min, 
                                               ccrs.PlateCarree())
    # 小地图上的点
    x2, y2 = ax_inset.projection.transform_point(lon_min, lat_min, 
                                                ccrs.PlateCarree())
    
    # 创建连接线
    con = ConnectionPatch((x1, y1), (x2, y2), "data", "data",
                         axesA=ax_main, axesB=ax_inset,
                         color="red", linewidth=1, alpha=0.7)
    ax_inset.add_artist(con)
    
    return con
```

### 2. 自定义样式

```python
def customize_map_style(ax, style='scientific'):
    """
    自定义地图样式
    """
    if style == 'scientific':
        # 科学论文风格
        ax.add_feature(cfeature.COASTLINE, linewidth=0.8, color='black')
        ax.add_feature(cfeature.BORDERS, linewidth=0.6, color='gray')
        ax.add_feature(cfeature.LAND, color='white')
        ax.add_feature(cfeature.OCEAN, color='lightblue', alpha=0.5)
        
    elif style == 'presentation':
        # 演示文稿风格
        ax.add_feature(cfeature.COASTLINE, linewidth=1.2, color='darkblue')
        ax.add_feature(cfeature.BORDERS, linewidth=0.8, color='darkgray')
        ax.add_feature(cfeature.LAND, color='lightgreen', alpha=0.3)
        ax.add_feature(cfeature.OCEAN, color='lightblue', alpha=0.7)
        
    elif style == 'minimal':
        # 简约风格
        ax.add_feature(cfeature.COASTLINE, linewidth=0.5, color='black')
        ax.add_feature(cfeature.BORDERS, linewidth=0.3, color='gray')
        ax.add_feature(cfeature.LAND, color='white')
        ax.add_feature(cfeature.OCEAN, color='white')
```

## 性能优化

### 1. 地图数据缓存

```python
class CachedMapCreator:
    """
    带缓存的地图创建器
    """
    
    def __init__(self):
        self.cached_features = {}
    
    def get_cached_feature(self, feature_name, resolution='50m'):
        """
        获取缓存的地图特征
        """
        cache_key = f"{feature_name}_{resolution}"
        if cache_key not in self.cached_features:
            if feature_name == 'coastline':
                self.cached_features[cache_key] = cfeature.COASTLINE.with_scale(resolution)
            elif feature_name == 'borders':
                self.cached_features[cache_key] = cfeature.BORDERS.with_scale(resolution)
            # 添加更多特征...
        
        return self.cached_features[cache_key]
```

### 2. 分辨率控制

```python
def create_optimized_map(main_extent, inset_extent, 
                        main_resolution='50m', inset_resolution='110m'):
    """
    创建优化的地图（不同分辨率）
    """
    fig = plt.figure(figsize=(12, 8))
    
    # 主地图使用高分辨率
    ax_main = fig.add_subplot(111, projection=ccrs.PlateCarree())
    ax_main.set_extent(main_extent, ccrs.PlateCarree())
    ax_main.add_feature(cfeature.COASTLINE.with_scale(main_resolution))
    ax_main.add_feature(cfeature.BORDERS.with_scale(main_resolution))
    
    # 小地图使用低分辨率
    ax_inset = fig.add_axes([0.02, 0.65, 0.3, 0.3], 
                           projection=ccrs.PlateCarree())
    ax_inset.set_extent(inset_extent, ccrs.PlateCarree())
    ax_inset.add_feature(cfeature.COASTLINE.with_scale(inset_resolution))
    ax_inset.add_feature(cfeature.BORDERS.with_scale(inset_resolution))
    
    return fig, ax_main, ax_inset
```

## 总结

通过本文的介绍，我们学习了如何使用Python创建带有小地图的地图可视化：

1. **基础概念**：了解了小地图的作用和应用场景
2. **基本实现**：掌握了使用cartopy创建小地图的基本方法
3. **高级功能**：学习了如何创建复杂的多小地图布局
4. **样式定制**：了解了如何自定义地图样式
5. **性能优化**：学习了提高地图渲染效率的方法

小地图是科学可视化中的重要工具，合理使用可以大大提升地图的信息传达效果。在实际应用中，需要根据具体需求选择合适的位置、大小和样式。

## 参考资源

- [Cartopy官方文档](https://scitools.org.uk/cartopy/docs/latest/)
- [Matplotlib官方文档](https://matplotlib.org/)
- [地图投影参考](https://proj.org/)

---

*希望这篇文章对您在Python地图可视化方面有所帮助！*
