
# 使用GFS数据驱动WRF模式





## Down GFS data 









数据下载网址：

https://nomads.ncep.noaa.gov/pub/data/nccf/com/gfs/prod/gfs.20220217/00/atmos/

数据：分辨率为1°x1°，每3个小时报一次。时间为2022年2月17日0时开始

```
gfs.t00z.pgrb2.1p00.f000                     17-Feb-2022 03:36   40M  
gfs.t00z.pgrb2.1p00.f003                     17-Feb-2022 03:37   43M  
gfs.t00z.pgrb2.1p00.f006                     17-Feb-2022 03:39   43M  

```

使用**downthemall** 批量下载：

![image-20220225164054792](https://gitee.com/jianpucom/picture/raw/master/202202251641728.png)



Upload GFS data to linux  server

## WPS前处理

### 1、链接到`GFS Vtable`

首先使用cd 命令，换到该数据所处路径下。然后使用命令进行链接：

```
cd  /Users/WRF/GFS_practice/
ln -sf ungrib/Variable_Tables/Vtable.GFS Vtable
```

然后，使用命令cd到WPS路径下将你下载的GFS数据进行链接，使用命令如下：

```
cd  /Users/WRF/WPS/
./link_grib.csh ../GFS_practice/gfs.t00z.pgrb2.1p00.f*
```

成功后在该文件下应该会出现一个vtable的文件

![image-20220225172308492](https://gitee.com/jianpucom/picture/raw/master/202202251723566.png)

下面几步操作还是在WPS路径下

### 2、ungrid

打开namelist.wps进行编辑，把时间改成你数据对应的时间范围：

![image-20220225172600869](https://gitee.com/jianpucom/picture/raw/master/202202251726915.png)

运行`./ungrib.exe`命令，显示如下表示成功

![image-20220225172708174](https://gitee.com/jianpucom/picture/raw/master/202202251727238.png)

### 3、geogrid

确保你有[陆地](https://www2.mmm.ucar.edu/wrf/OnLineTutorial/Basics/GEOGRID/ter_data.php)数据，编辑namelist.wps中的geogrid部分。

```
&geogrid
 parent_id         =   1,      1,      2,
 parent_grid_ratio =   1,      3,      3,
 i_parent_start    =   1,      122,    200,
 j_parent_start    =   1,      123,    180,
 e_we              =   450,    631,   1781,    
 e_sn              =   450,    631,   1781,
 geog_data_res     = 'default', 'default',  'default',
 dx = 10000,
 dy = 10000,
 map_proj  = 'mercator',
 ref_lat   =  0.00,
 ref_lon   = 150.00,
 truelat1  =  15.0,
 truelat2  =  30.0,
 stand_lon = 150.00,
  geog_data_path = '/Software/Models/WRF/WPS_GEOG',
```

确保区域位于正确的位置，运行以下代码进行查看：

`ncl util/plotgrids_new.ncl`   

![image-20220225231754022](https://gitee.com/jianpucom/picture/raw/master/image-20220225231754022.png)



确认好区域位置后，进行`geogrid`，运行命令：`./geogrid.exe`，运行成功显示如下内容：

![image-20220225232037085](https://gitee.com/jianpucom/picture/raw/master/image-20220225232037085.png)

同时，你会得到如下文件：

![image-20220225232100244](https://gitee.com/jianpucom/picture/raw/master/image-20220225232100244.png)

### 4、Metgrid

下面进行插值，将数据插值到模式区域，这里不需要对namelis.wps进行修改。运行命令：

`./metgrid.exe`

![image-20220225232333579](https://gitee.com/jianpucom/picture/raw/master/image-20220225232333579.png)

同时会得到相应插值后的nc格式的文件：

![image-20220225232413818](https://gitee.com/jianpucom/picture/raw/master/image-20220225232413818.png)

以上，WPS前处理完成。下面进行WRF处理。

## WRF后处理

主要以下三步：

- 1、链接在WPS中插值出的数据
- 2、运行./real.exe
- 3、运行./wrf.exe

### 链接插值的nc数据

使用cd命令切换到WRF/run/ 下，首先需要链接刚刚插值的数据：

`ln -sf ../../../GFSout/met_em.* .`  

第二步，对namelist.input进行编辑，部分内容需要与WPS下的namelist.wps内容一致

```
 &time_control
 run_days                            = 0,
 run_hours                           = 06,
 run_minutes                         = 0,
 run_seconds                         = 0,
 start_year                          = 2022, 2022, 2022,
 start_month                         = 02,   02,   02,
 start_day                           = 17,   17,   17,
 start_hour                          = 00,   00,   00,
 end_year                            = 2022, 2022, 2022,
 end_month                           = 02,   02,   02,
 end_day                             = 17,   17,   17,
 end_hour                            = 06,   06,   06,
 interval_seconds                    = 21600
 input_from_file                     = .true.,.true.,.true.,
 history_interval                    = 60,  60,   60,    # 设置输出的时间，每一小时一个
 frames_per_outfile                  = 1000, 1000, 1000,
 restart                             = .false.,
 restart_interval                    = 1440,
 io_form_history                     = 2
 io_form_restart                     = 2
 io_form_input                       = 2
 io_form_boundary                    = 2
 /

 &domains
 time_step                           = 60,
 time_step_fract_num                 = 0,
 time_step_fract_den                 = 1,
 max_dom                             = 2,
 e_we              =   450,    631,   1781,    
 e_sn              =   450,    631,   1781,
 e_vert                              = 33,    33,   33,
 p_top_requested                     = 5000,
 num_metgrid_levels                  = 34,
 num_metgrid_soil_levels             = 4,
 dx                                  =  10000,  3333.33,
 dy                                  =  10000,  3333.33,
 grid_id                             = 1,     2,     3,
 parent_id         =   1,      1,      2,
 parent_grid_ratio =   1,      3,      3,
 i_parent_start    =   1,      122,    200,
 j_parent_start    =   1,      123,    180,
 parent_time_step_ratio              = 1,     3,     3,
 feedback                            = 1,
 smooth_option                       = 0
 /

```



### 运行./real.exe

编辑好之后，确保与WPS前处理中的namelist.wps中的保证一致后，运行命令：`./real.exe`

![image-20220225233725399](https://gitee.com/jianpucom/picture/raw/master/image-20220225233725399.png)

同时，会得到如下三个文件：

![image-20220225233757565](https://gitee.com/jianpucom/picture/raw/master/image-20220225233757565.png)

### 运行./wrf.exe

之后，运行`wrf.exe`，生成以下文件表示成功

![image-20220226163941686](https://gitee.com/jianpucom/picture/raw/master/image-20220226163941686.png)

### Note：

如果设置的起始终止时间比较久，可以上传到学院集群中进行运行。或者编辑一个`.sh`脚本文件，放在服务器后台运行。



## 验证模式数据

对跑出来的数据进行验证，检验区域是否正确。使用`ncview`进行查看：

![image-20220226163848832](https://gitee.com/jianpucom/picture/raw/master/image-20220226163848832.png)

可以发现，与之间使用`ncl命令`查看的区域是一致的