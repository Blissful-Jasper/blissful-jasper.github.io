
### 1、打开一个终端

打开 `git bash`

### 2、创建一个空的文件夹


文件夹名称如：`blog`



```bash
mkdir blog
cd blog
```

### 3、初始化一个git仓库

使用自己的仓库的名字

```bash
git init REPOSITORY-NAME
```


### 4、从新的分支上发布你的网页



从`gh-pages`这个分支发布你的网页：

```bash
git checkout --orphan gh-pages
# Creates a new branch, with no history or contents, called gh-pages, and switches to the gh-pages branch
git rm -rf .
# Removes the contents from your default branch from the working directory
```

### 5、使用 `jekyll new` 创建新的网页
```bash
jekyll new --skip-bundle .
```


### 6、打开创建后生成的Gemfile这个文件夹


运行`bundel install`命令

![cat](https://s2.loli.net/2023/12/18/LaRItkhmpAPSWCw.png)
### 7、测试网页
打开`_config.yml`文件，修改url为自己的github的网页


```bash
domain: my-site.github.io       # if you want to force HTTPS, specify the domain without the http at the start, e.g. example.com
url: https://my-site.github.io  # the base hostname and protocol for your site, e.g. http://example.com
baseurl: /REPOSITORY-NAME/      # place folder name if the site is served in a subfolder

```
在本地测试自己的网页：

```bash
git add .
git commit -m 'Initial GitHub pages site with Jekyll'
```


连接你的远程仓库，这里注意替换为你自己的仓库名称：

```bash
 git remote add origin https://github.com/USER/REPOSITORY.git
```


推送你修改的内容到远程仓库：

```bash
git push -u origin gh-pages
```


### 8、更新Github

推送成功后，打开你的远程仓库，点击设置-Pages，在Branch下面选择你刚刚提交的分支，点击save，稍等几分钟后就可以看见你的网页啦

![image-2.png](https://s2.loli.net/2023/12/18/aizMxWNhJR4rfV2.png)


### 9、选择一个jekyll主题

打开你的`Gemfile`文件,将下面的内容添加进去：


```bash

gem "academic-jekyll-theme"

```

添加保存后，打开你的`_config.yml`文件，修改theme后面的内容：

```bash
theme: academic-jekyll-theme
```
运行`bundel`

如果说版本不符合的话，可以尝试直接安装：

```bash
gem install academic-jekyll-theme
```

还有一种官方的方法：

https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/adding-a-theme-to-your-github-pages-site-using-jekyll

在本地显示网页：
```bash
bundle exec jekyll serve
```

### 10、上传到远程仓库

```bash
git add .
```

```bash
git commit -m 'Initial GitHub pages site with Jekyll'
```

```bash
# 修改为你自己的仓库地址
git remote add origin https://github.com/USER/REPOSITORY.git
```

```bash
# 推送到你指定的分支上
git push -u origin BRANCH
```
