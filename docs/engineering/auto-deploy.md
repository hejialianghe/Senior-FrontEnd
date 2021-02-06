## 6.1  travis与github

#### 什么是持续集成 ？

Travis CI 提供的是持续集成服务，它可以绑定github上的项目，可以指定监视某个分支，只要push了新的代码，就会自动抓取；它提供一个运行环境，执行测试，完成构建，还能部署到服务器。

因为Travis 和github是兄弟，所以目前市场份额最大。

#### 我们的要实现的功能？

当我们push代码到github仓库的时候，完成自己的服务器（`blog.youliaowu.com`）和github提供免费的服务器（`hejialianghe.github.io`）的部署。

### 6.1.1 前期准备

首先我们准备一个github账号，然后访问[Travis Ci](https://www.travis-ci.org/)；用github账号去登录;然后点红色标识的按钮更新仓库，点蓝色标识的部分触发某个项目进行构建。

![](~@/engineering/travis.png)

### 6.1.2 完成hejialianghe.github.io的部署

#### 1. 在github上生成token

因为travis在编译好后需要把编译好的代码push到`hejialianghe.github.io`仓库中去，那肯定需要一个标识去验证，这就是我们生成token的意义！

点自己github右上角的图像-> 点Settings->左边会有一个列表点击Developer settings->在点击Personal access tokens->点击Generate new token->为token起一个名字access_token,列表全部勾选，然后点击Generate token生成。

 <font color="red">**生成token后不要关闭当前页面，请记下此token；因为它只显示一次，忘记了只能再次生成。**</font>

#### 2. 给Travis设置环境变量

我们刚刚在github上生成了token，把这个token设置为Travis对应的环境变量上，后面的执行脚本中会用到这个token，为了避免明文token，才设置为环境变量，那下面我们设置环境变量。

我们进入Travis网站，点进构建的项目中去，然后点击右上角蓝色部分->点击Settings

![](~@/engineering/travissetting.png)

name设置为access_token，value设置为github上生成的token，点击add添加环境变量。

![](~@/engineering/access-token.png)

#### 3. 在项目根目录建.travis.yml和deploy.sh

.travis.yml配置
```bash
language: node_js
node_js: 
  - lts/* #设置语言版本，lts表示稳定版
branches:
  only:
    - master #设置只监听哪个分支
cache: #缓存
  apt: true
  yarn: true
  directories: 
    - node_modules 
install:  # 安装依赖
  - yarn
script:  # 需要执行的脚本
    - yarn build
    - sh ./deploy.sh
```
deploy.sh配置

```bash
#!usr/bin/env sh
#当发生错误中止脚本
set -e
# cd 到构建输出的目录下
cd dist
git init
git add -A
git commit -m 'deploy'
# 这里的access_token是travis设置的环境变量
git push -f https://${access_token}@github.com/hejialianghe/hejialianghe.github.io master
cd -  # 返回上一层
```
写到这里，<font color="red">**我们只需把代码push到master分支就能完成构建与部署**</font>，可以参考的源码：[源码地址](https://github.com/hejialianghe/Senior-FrontEnd.git)

### 6.1.3 完成blog.youliaowu.com的部署

#### 1.生成公钥和私匙，把公钥拷贝到部署服务器

为什么生成公钥和私匙？

因为Travis需要把构建好的代码上传到部署服务器，上传需要验证，所以我们采用ssh`公钥和私匙`的方式登录部署服务器。

:tomato: 执行ssh-keygen -t rsa 生成生成公钥和私匙

```bash
 ssh-keygen -t rsa  # 在自己的电脑执行此命令，一路按回车即可，window电脑打开bash执行
```
成功后会显示以下信息，id_rsa是私匙，id_rsa.pub是公钥，下面还显示它们所在的路径。

Your identification has been saved in /Users/hejialiang/.ssh/id_rsa

Your public key has been saved in /Users/hejialiang/.ssh/id_rsa.pub

:tomato: 把公钥拷贝到自己的服务器

```bash
 # ssh-copy-id <登录部署服务器用户名>@<部署服务器地址> -p <部署服务器ssh端口>
 # 如果ssh默认端口是22，则不需要 -p
 ssh-copy-id root@122.51.11.29 # 这条命令会把公钥添加到服务器~/.ssh/目录下authorized_keys文件中
 # 这条命令是登录自己的服务器，如果不需要输入密码，说明你的公钥添加成功，这只是为了验证公钥是否添加成功
 ssh root@122.51.11.29 
```
执行上面3条命令我们成功的把公钥添加到了部署服务器，那么下面我们在把私匙添加到Travis中。

#### 2.把私匙添加到Travis中

为了避免私钥泄露，我们还需要对私钥进行加密，这里要用Travis命令行工具进行加密，因为我们的电脑没有Travis命令行工具，所以要进行下载安装，
下载Travis需要用ruby的包gem，mac电脑内置了ruby，所以不需要下载，其它系统需要先下载最新ruby，我们以mac电脑为例。

上面我们登录了的服务器，现在我们退出服务器，或者在打来一个命令行工具，去执行以下操作

:tomato: 下载travis
```bash
# 查看镜像源
gem sources -l
# 添加阿里镜像源，删除国外镜像源，为了下载速度更快
gem sources --add http://mirrors.aliyun.com/rubygems/ --remove https://rubygems.org/
# 下载travis
sudo gem install travis
```
travis下载成功后，我们利用它给私钥加密。

:tomato: 给私匙加密

我们把路径切换到我们项目的根目录，cd /Users/hejialiang/Desktop/vue/Senior-FrontEnd，当然这是我的目录，切换到自己的
项目根目录即可，然后执行以下命令,要注意的是项目里根目录要有`.git`文件，否则会出现问题。

```bash
# --auto自动登录github帐号，输入自己的github账号密码即可
travis login --auto
# --add参数可以自动把环境变量写入.travis.yml
sudo travis encrypt-file ~/.ssh/id_rsa --add
```
该命令会生成一个环境变量$encrypted_844372f51c48_key，保存密钥，储存在 Travis CI，文件解密时需要这个环境变量。

执行完以后，travis网站项目设置里的环境变量里多了两个参数，并且在.travis.yml里的before_install周期中多了下面这2行，
还在项目的根目录生成了加密的私钥id_rsa.enc

```bash
before_install:
- openssl aes-256-cbc -K $encrypted_31539db9e051_key -iv $encrypted_31539db9e051_iv
  -in id_rsa.enc -out ~\/.ssh/id_rsa -d
```
我们把上面`~\/.ssh/id_rsa -d`的转义符`\`去掉，我们不需要这个转义符。

:tomato: 下面是完整的.travis.yml配置
```bash
language: node_js
node_js: 
  - lts/* #设置语言版本，lts表示稳定版
branches:
  only:
    - master #设置只监听哪个分支
cache:
  apt: true
  yarn: true
  directories: 
    - node_modules #缓存依赖
before_install:
- openssl aes-256-cbc -K $encrypted_844372f51c48_key -iv $encrypted_844372f51c48_iv
  -in id_rsa.enc -out  ~/.ssh/id_rsa -d # id_rsa.enc加密的私钥
- chmod 600 ~/.ssh/id_rsa # 降低 id_rsa 文件的权限
- echo -e "Host 122.51.11.29\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config # 将生产服务器地址加入到测试机的信任列表中
install:  # 安装依赖
  - yarn

script:  # 需要执行的脚本
    - yarn build
    - sh ./deploy.sh

addons:
  ssh_known_hosts: 122.51.11.29 # 添加 SSH 信任列表
after_success: # script 阶段成功时执行
- scp  -o stricthostkeychecking=no -r ./dist/* root@122.51.11.29:/home/www/blog  # 使用scp拷贝到服务
```
把上面的ip替换成自己的即可，scp是拷贝travis服务器dist目录下所有的资源到部署服务器的/home/www/blog目录下，这个dist目录是你的webpack生成的目录。

接下来把代码push到github就算大功告成！

<font color="red">**我们可以travis-ci网站，去查看项目的构建情况，可以看见脚本输出的展示信息。**</font>

### 6.1.4 遇到的问题

#### 1.要下载的ruby最新版

我开始准备在linux服务器上去给私钥加密的，在linux服务器下载ruby，我使用的`sudo yum install ruby`方式下载，给我下载的不是最新版本，
是`2.0.0`版本，导致后面出现一系列问题；所以下载要最新版本的，不要使用`sudo yum install ruby`下载，我的mac上`2.3.7`版中没有出现问题，
mac内置ruby哦，所以不需要安装；window上直接下载安装包即可，可能会出现一些问题，有问题直接百度吧，一般都是有答案的。

linux上建议用编译源码的安装方式

```bash
mkdir -p /usr/local/ruby # 创建ruby目录
cd usr/local/ruby  # 进入
wget https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.0-preview1.tar.gz #下载
tar -zxvf ruby-2.7.0-preview1.tar.gz # 解压
cd ./ruby-2.7.0-preview1
./configure --prefix=/usr/local/ruby # 配置并指定安装位置
make  && make install  # 编译安装
ln -s /usr/local/ruby/bin/ruby /usr/local/bin/ruby # 设置全局软链接
```
#### 2.私钥加密生成的环境变量问题

私钥加密后要去travis网站下看看本项目设置里是否多了2个环境变量，一个是`$encrypted_31539db9e051_key`和`$encrypted_31539db9e051_iv`。

我们查看的网站是`https://www.travis-ci.org/`看而不是com后缀的`https://travis-ci.com/`，2个网站的变量不能同步，除非在com的网站里导入org里的环境变量。

#### 3.上传到自己的服务器可能出现超时的问题

因为travis是国外的网站，上传到国内的服务器可能出现超时现象，可以travis.yml中配置脚本进行压缩后在上传。

### 6.1.5 总结

上传到github服务器上其实很简单，关键是上传到自己的服务器会出现一些问题，基本都是安装包的问题，如果出现问题可以和我交流，在本项目的指南介绍中有联系方式，
看在博主辛苦输出内容， <font color="red">**帮我的项目点个star**</font>[源码地址](https://github.com/hejialianghe/Senior-FrontEnd)。
