



# 如何在一个地图上嵌入一个子图

当我们进行WRF数值模拟时，通过会使用矩形框突出显示模拟的区域，这样有利于读者对你模拟的区域有更清晰的认知。这个时候，就可以尝试使用地图嵌套的展示方式。这里以普通的地图嵌套进行讲解，以python来进行实现。效果图如下所示：

<img src="https://s2.loli.net/2023/12/27/LHkNucnJSAeOfyV.png" alt="ShangHai_map_add" style="max-width: 100%; height: auto;">


主要技术难点：

- 跨越两个子图的虚线连接

## 导入基本的python 包



```python
import matplotlib.patches as mpatches
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from cartopy.mpl.ticker import LongitudeFormatter,LatitudeFormatter
import matplotlib.ticker as ticker
import numpy as np
import xarray as xr
import matplotlib.pyplot as plt
import matplotlib
import matplotlib.colors
import cmaps
```



## 绘制地形起伏地图

```python
path = r'./ETOPO2v2c_f4.nc'
data = xr.open_dataset(path).sel(y=slice(0,35),x=slice(118,125))
lon = data.x.data
lat = data.y.data
colors11 = plt.cm.terrain(np.linspace(0,0.09,150))
colors12 = plt.cm.terrain(np.linspace(0.09,0.15,100))
colors21 = plt.cm.terrain(np.linspace(0.23,0.4,10))
colors22 = plt.cm.terrain(np.linspace(0.4,0.85,240))
colors_below  = np.vstack((colors11, colors12))
colors_upper  = np.vstack((colors21, colors22))
colors = np.vstack((colors_below, colors_upper))
cmaps   = matplotlib.colors.LinearSegmentedColormap.from_list('hls', colors)
norm = matplotlib.colors.Normalize(vmin=-2000, vmax=2000)

# set map region
box   = [120.5,123,30.5,32.5]
xtick = np.arange(box[0], box[1]+0.1, 0.5)
ytick = np.arange(box[2], box[3]+0.1, 0.5)

# set font
plt.rcParams['font.sans-serif'] = ['Times New Roman']

# Create figure and axes
fig = plt.figure(figsize=(10, 8), dpi=300)
proj = ccrs.PlateCarree()

# Main subplot
ax = fig.add_axes([0, 0.5, 0.8, 0.8], projection=proj)
ax.set_extent([120.5, 123, 30.5, 32], crs=ccrs.PlateCarree())
ax.add_feature(cfeature.LAKES.with_scale('10m'), color='lightskyblue', alpha=.99)
ax.add_feature(cfeature.RIVERS.with_scale('10m'))
ax.add_feature(cfeature.OCEAN.with_scale('10m'))
ax.add_feature(cfeature.LAND.with_scale('10m'))
cf = ax.contourf(lon, lat, data['z'], norm=norm,
                 levels=np.arange(-2000, 2001, 50),
                 transform=ccrs.PlateCarree(),
                 cmap=cmaps, extend='neither')
cbar = fig.colorbar(cf, ax=ax, label='Global Elevation (meter)',shrink=0.55,
                    format=ticker.ScalarFormatter(useMathText=True))
cbar.ax.tick_params(which='major', direction='in')

# Scatter points
points = [(121.84, 31.3), (121.47, 31.23), (121.65, 31.86), (120.75, 30.75)]
for point in points:
    ax.scatter(point[0], point[1], transform=ccrs.PlateCarree(), marker='o',
               alpha=0.8, s=100, edgecolor='black', color='r' if point[0] == 121.84 else 'w')

# Annotations

ax.annotate('Shanghai', (121.47, 31.26))
ax.annotate('Qidong', (121.65, 31.89))
ax.annotate('Jiaxing', (120.75, 30.79))

# Gridlines and ticks
xtick = np.arange(120.5, 123.1, 0.5)
ytick = np.arange(30.5, 32.1, 0.5)
tick_proj = ccrs.PlateCarree()
ax.set_xticks(xtick, crs=tick_proj)
ax.set_yticks(ytick, crs=tick_proj)
ax.gridlines(linestyle='--', xlocs=xtick, ylocs=ytick, zorder=2, linewidth=0.5, color='grey')

# Arrow and labels
arrow_x, arrow_y, arrow_length = 0.94, 0.86, 0.05
ax.arrow(arrow_x, arrow_y, 0, arrow_length, transform=ax.transAxes,
         color='black', width=0.001, head_width=0.01, head_length=0.03)

ax.text(122.7, 31.5, 'East sea', ha='right', va='center', fontsize=18, transform=ccrs.PlateCarree())
ax.tick_params(which='major', direction='in',pad=8)
# Zoomed-in subplot
ax.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))
ax.yaxis.set_major_formatter(LatitudeFormatter())
```
运行上述代码，应该会得到如下的地图：



<img src="https://s2.loli.net/2023/12/27/B1cISnoRXKdY7hm.png" alt="ShangHai_map_1.png" style="max-width: 100%; height: auto;">


## 子图嵌套
这里的方法实际上就是通过`fig.add_axes()`方法再创建一个子图，然后通过`mpatches ConnectionPatch()`找个函数实现两个子图的连接。

听起来很简单，但是需要注意在使用`mpatches ConnectionPatch()`时，要确保坐标的设立：

官方函数说明在这：https://matplotlib.org/stable/api/_as_gen/matplotlib.patches.ConnectionPatch.html

```python
matplotlib.patches.ConnectionPatch(xyA, xyB, coordsA, coordsB=None, *, axesA=None, axesB=None, arrowstyle='-', connectionstyle='arc3', patchA=None, patchB=None, shrinkA=0.0, shrinkB=0.0, mutation_scale=10.0, mutation_aspect=None, clip_on=False, **kwargs)
```

他需要传入
- 1、第一个虚线的的起始坐标（查看第一个子图，你希望以哪个点坐标作为连接点）
- 2、第一条虚线的坐标终止坐标（查看第二个子图，你希望以哪个点坐标作为连接点）
- 3、设置第一个坐标轴
- 4、设置第二个坐标轴

以上四个数据是实现跨子图连接的关键，下面是一个示例：

```python

mpatches.ConnectionPatch((line_x[0], line_y[0]), (line_x[0], line_y[1]),
                            coordsA=ax.transData, coordsB=ax2.transData, 
                            )
# 这里包括：第一个连接点起始点(line_x[0], line_y[0])；第一个连接点终点(line_x[0], line_y[1]),[0])；第一个坐标轴为第一个子图：coordsA=ax.transData；第二个坐标轴为第二各自图：coordsB=ax2.transData, 

```

完成以上设置后，将其作为一个patch添加到地图上，即完成了一条跨越两个子图的连接,展示效果如下所示：



<img src="https://s2.loli.net/2023/12/27/2hUk9GzrpfPFK1i.png" alt="ShangHai_map_2.png" style="max-width: 100%; height: auto;">


然后，根据自己的需求添加连接线的数量即可。

图中所使用的地图填色数据来自于National Centers for
Environmental Information：https://www.ngdc.noaa.gov/mgg/global/relief/ETOPO2/ETOPO2v2-2006/ETOPO2v2c/netCDF/


如果访问不了，也可以通过下面的链接进行下载：

地形数据下载链接：https://density.lanzouj.com/iaFyF1j4t78j

## 设置地图底色
对于地形的colormap，这里分享一个好用的工具包PyGMT：https://www.pygmt.org/v0.3.0/tutorials/earth-relief.html


提供了很多好看的绘制图片，可以进行参考



![](https://www.pygmt.org/v0.3.0/_images/sphx_glr_earth-relief_001.png)


<!-- ![](https://www.pygmt.org/v0.3.0/_images/sphx_glr_earth-relief_005.png)


![](https://www.pygmt.org/v0.3.0/_images/sphx_glr_earth-relief_006.png) -->

## 全部代码

以下是所有的python代码：

```python
"""
Created on Wed Dec 27 20:27:53 2023

@author: Jianpu

@blog:  https://xpji.github.io/Jianpu.github.io/

@email: Xpji@hhu.edu.cn

@introduction: keep learning although slowly
"""

import matplotlib.patches as mpatches
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from cartopy.mpl.ticker import LongitudeFormatter,LatitudeFormatter
import matplotlib.ticker as ticker
import numpy as np
import xarray as xr
import matplotlib.pyplot as plt
import matplotlib
import matplotlib.colors
import cmaps



path = r'./ETOPO2v2c_f4.nc'
data = xr.open_dataset(path).sel(y=slice(0,35),
                                x=slice(118,125))
lon = data.x.data
lat = data.y.data
colors11 = plt.cm.terrain(np.linspace(0,0.09,150))
colors12 = plt.cm.terrain(np.linspace(0.09,0.15,100))
colors21 = plt.cm.terrain(np.linspace(0.23,0.4,10))
colors22 = plt.cm.terrain(np.linspace(0.4,0.85,240))
colors_below  = np.vstack((colors11, colors12))
colors_upper  = np.vstack((colors21, colors22))
colors = np.vstack((colors_below, colors_upper))
cmaps   = matplotlib.colors.LinearSegmentedColormap.from_list('hls', colors)
norm = matplotlib.colors.Normalize(vmin=-2000, vmax=2000)

box   = [120.5,123,30.5,32.5]
xtick = np.arange(box[0], box[1]+0.1, 0.5)
ytick = np.arange(box[2], box[3]+0.1, 0.5)

plt.rcParams['font.sans-serif'] = ['Times New Roman']


#############################################################################################################################

# Create figure and axes
fig = plt.figure(figsize=(10, 8), dpi=300)
proj = ccrs.PlateCarree()

# Main subplot
ax = fig.add_axes([0, 0.5, 0.8, 0.8], projection=proj)
ax.set_extent([120.5, 123, 30.5, 32], crs=ccrs.PlateCarree())
ax.add_feature(cfeature.LAKES.with_scale('10m'), color='lightskyblue', alpha=.99)
ax.add_feature(cfeature.RIVERS.with_scale('10m'))
ax.add_feature(cfeature.OCEAN.with_scale('10m'))
ax.add_feature(cfeature.LAND.with_scale('10m'))
cf = ax.contourf(lon, lat, data['z'], norm=norm,
                 levels=np.arange(-2000, 2001, 50),
                 transform=ccrs.PlateCarree(),
                 cmap=cmaps, extend='neither')
cbar = fig.colorbar(cf, ax=ax, label='Global Elevation (meter)',shrink=0.55,
                    format=ticker.ScalarFormatter(useMathText=True))
cbar.ax.tick_params(which='major', direction='in')

# Scatter points
points = [(121.84, 31.3), (121.47, 31.23), (121.65, 31.86), (120.75, 30.75)]
for point in points:
    ax.scatter(point[0], point[1], transform=ccrs.PlateCarree(), marker='o',
               alpha=0.8, s=100, edgecolor='black', color='r' if point[0] == 121.84 else 'w')

# Annotations

ax.annotate('Shanghai', (121.47, 31.26))
ax.annotate('Qidong', (121.65, 31.89))
ax.annotate('Jiaxing', (120.75, 30.79))

# Gridlines and ticks
xtick = np.arange(120.5, 123.1, 0.5)
ytick = np.arange(30.5, 32.1, 0.5)
tick_proj = ccrs.PlateCarree()
ax.set_xticks(xtick, crs=tick_proj)
ax.set_yticks(ytick, crs=tick_proj)
ax.gridlines(linestyle='--', xlocs=xtick, ylocs=ytick, zorder=2, linewidth=0.5, color='grey')

# Arrow and labels
arrow_x, arrow_y, arrow_length = 0.94, 0.86, 0.05
ax.arrow(arrow_x, arrow_y, 0, arrow_length, transform=ax.transAxes,
         color='black', width=0.001, head_width=0.01, head_length=0.03)

ax.text(122.7, 31.5, 'East sea', ha='right', va='center', fontsize=18, transform=ccrs.PlateCarree())
ax.tick_params(which='major', direction='in',pad=8)
# Zoomed-in subplot
ax.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))
ax.yaxis.set_major_formatter(LatitudeFormatter())

ax2 = fig.add_axes([0.33, 0.22, 0.4, 0.4], projection=proj)
ax2.set_extent([121.5, 122, 31, 31.5], crs=ccrs.PlateCarree())
ax2.add_feature(cfeature.LAKES.with_scale('10m'), color='lightskyblue', alpha=.99)
ax2.add_feature(cfeature.RIVERS.with_scale('10m'))
ax2.add_feature(cfeature.OCEAN.with_scale('10m'))
ax2.add_feature(cfeature.LAND.with_scale('10m'))
cf_zoomed = ax2.contourf(lon, lat, data['z'], levels=np.arange(-2000, 2001, 50),
                          transform=ccrs.PlateCarree(), cmap=cmaps, extend='neither')
ax.plot([121.5,122,122,121.5,121.5],[31,31,31.5,31.5,31],lw=1,transform=ccrs.PlateCarree(),
        color='tab:red')
xtick2 = np.arange(121.5, 122.1, 0.1)
ytick2 = np.arange(31, 31.6, 0.2)
ax2.set_xticks(xtick2, crs=tick_proj)
ax2.set_yticks(ytick2, crs=tick_proj)
ax2.gridlines(linestyle='--', xlocs=[121.5,121.6,121.7,121.8,121.9], ylocs=[31,31.2,31.4,31.6], zorder=2, linewidth=0.5, color='grey')

line_x = [121.5, 122, 122, 121.5, 121.5]
line_y = [31, 31, 31.5, 31.5, 31]

line = mpatches.ConnectionPatch((line_x[0], line_y[0]), (line_x[0], line_y[1]),
                            coordsA=ax.transData, coordsB=ax2.transData, 
                            color='tab:red'
                                )
ax2.add_patch(line)

line1 = mpatches.ConnectionPatch((line_x[1], line_y[2]), (line_x[1], 31.6),
                            coordsA=ax.transData, coordsB=ax2.transData, 
                            color='tab:red'
                                )
ax2.add_patch(line1)

ax2.annotate('HSD', (121.85, 31.3), xytext=(5, -10), textcoords='offset points',
            arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0.9'))

ax2.scatter(121.84, 31.30, transform=ccrs.PlateCarree(), marker='o',
           alpha=0.8, s=100, edgecolor='black', color='r' )

ax2.xaxis.set_major_formatter(LongitudeFormatter(zero_direction_label =False))
ax2.yaxis.set_major_formatter(LatitudeFormatter())
ax2.tick_params(which='major', direction='in',pad=8)




# fig.savefig('./ShangHai_map_add.png',bbox_inches='tight',dpi=300 )

```