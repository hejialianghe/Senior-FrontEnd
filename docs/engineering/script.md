## 1.1 玩转npm scripts

#### 常用命令

- npm init ：初始化工程
- npm run ：run script
- npm install ：安装依赖
- npm update ：升级依赖
- npm bin：查看bin文件目录
- npm link ：将工程软连接到全局
- npm publish ：发布包
- npm deprecate ：废弃包

### 1.1.1  内部变量

问题：输出the package is xxx@x.x.x(输出package里的一些信息)

答案：$npm_package_*

```bash
    $npm_package_name # 输出package里的name
    $npm_package_version # 输出package里的name
    $npm_package_config_var1 # 输出package里的config里的var1
```
当我们npm run 执行脚本的时候，npm读取package转换为shell变量，所以我们才能在脚本中拿到这些变量

### 1.1.2  npm scripts -参数

问题：如何对npm scripts二次包装多的命令传参

答案：利用`--透传参数`

```js
{
    "script":{
        "serve":"server ./build",
        "serve":"npm run serve -- -l 80"
    }
}
```

### 1.1.2  npm scripts -脚本钩子

- 脚本钩子类似于hook，当事件触发时，对应的钩子逻辑也被触发，git hook、web hook等
- 部分npm内置脚本钩子如下：

```bash
    preinstall # 用户执行npm install命令时候，先执行脚本
    postinstall # 用户执行npm install命令是，安装结束后执行该脚本
    preuninstall # 卸载一个模块前执行
    postuninstall # 卸载一个模块后执行
    prelink # link模块前执行
    postlink # link模块后执行
    pretest # 运行npm test命令前执行
    posttest # 运行npm test命令后执行
```
- 规律：pre-* 和 post-*

除了内置脚本钩子，我们也可以按照规则自定义添加钩子

- 例子：自动化发版

```js
    #!/usr/bin/env node
    const semver=require('semver')
    const packageInfo=require('../pageage.json')
    const fs=require('fs')
    const targetVersion=semver.inc(packageInfo.version)
    packageInfo.version=targetVersion
    ...
```
### 1.1.3 思考

1. 为什么脚本第一行需要有`#!usr/bin/env node`

`#!`是一个特殊的标示符，后面跟的是解释脚本的路径，说明这个文件可以当作脚本来运行，`usr/bin/env/ node` 表示通过env来运行node，env将会从环境变量中查找node工具

2. 如果想在一条script里顺序执行两个命令，应该怎么写？

用`;`隔开

3. 如果想在一条script里并行执行两个命令？

用`&&`隔开

## 1.2 bash简洁和快速入门

#### shell是什么？

1. shell 不仅仅是命令行，也可以是GUI
2. Shell 是操作系统和用户交互的“接口”
3. 一般来说，我们说的Shell都是Unix Shell，可以任务是CLI

#### 命令（Command）是什么？

1. 命令的本质是一个程序
2. 这些程序具有发起系统调用（System call）的能力
3. 编写shell脚本，其实是在编排这些程序的执行
4. 除此之外，还有shell语法解释器负责解释一行行的Shell语句

#### Shell解释器

1. bash (linux/Unix)
2. sh   (linux/Unix)
3. zsh  （linux/Unix)
4. cmd  （windows）
5. PowerShell （windows）
6. WSL (Windows Subsysstem of linux)

### 1.2.1 常用的bash命令

#### 其实我们平时已经使用了很多bash命令

```bash
    cd ./xxx
    ls -al
    rm -rf ./*.log
    mkdir react-demo
    ps -a u x # ps 查看进程
    kill 3790 # 杀掉进程
```

<font color="red">**没有什么是-h解决不了的，如果有就用man**</font>

有时候命令太多，参数太多，我们不能全部记得，我们可以man去查看一个命令的用法

```bash
   #例如
    man ps
   # 退出，按字母q
    q 
```
#### 文件新建

- touch(新建文件)

```bash
 touch ./index.js
```

- mkdir(新建文件夹)

```bash
 mkdir ./project
```

#### 文件删除

- rmdir 

```bash
 rmdir ./project
```
- rm

```bash
 rm ./projcet
 rm -r ./project # 递归删除
 rm -rf ./project # 强制递归删除
```
#### 文件删移动

- mv 

```bash
 mv ./source.txt ./target
 mv -f ./source/a.txt ./target # 移动并强制覆盖
 mv -n ./source/a.txt ./target # 移动不覆盖
```

- cp

```bash
 cp ./source.txt ./target/
 cp -R ./source/a.txt ./target/ # 递归复制
```

#### 文件查看

cat、head、tail

```bash
 cat package.json # 查看文件
 head -n 10 ~/.logs/sevive-a.log # 查看文件的前10行
 tail -n 10 ~/.logs/sevive-a.log # 查看文件的后10行
```

#### 文件编辑

- nano

GNU nano是linux上最简单的文本编辑器，操作简单，功能也比较初级，对于一些临时和简单的文件编辑操作，我们可以直接使用nano就好

- vi/vim

vi是linux上的一款功能强大的编辑器，vim更是vi的加强版。vim和emacs都是cli世界中的编辑器王者，如果能够熟练使用，效率完全不输于现代的GUI编辑器（如vscode），但是由于使用比较复杂，内容超出了本节的范围

#### 进程相关

- ps

```bash
 ps # 查看当前用户进程
 ps -ax # 查看所有进程
```

- lsof

```bash
 lsof -i # 查看打开网络的相关文件
 lsof -p 2333  # 查看pid=233的进程打开的文件
```

- top

```bash
top # 查看实时的电脑使用情况
```

- kill

```bash
kill 45934 # SIGTERM信号
kill -9 45934 # SIGKILL信号，强杀进程
```

kill命令实际上并不是在“kill”，本质是向进程发送信号。例如：kill-s SIGUSR1 34534 实际上可以调试
Nodejs应用，因为Nodejs会在收到SIGUSR1时进入调试模式

优雅退出的原理就是监听SIGTERM信号，并递归退出子进程

#### 其他

- grep （对结果的每一行进行筛选）

```bash
  lsof -i | grep LISTEN  # 找到所有正在被监听的端口
```
- awk

```bash
 docker rm $(docker ps -a | awk 'NR>1{print $1}') # 删除所有的docker容器
 chmod +x ${ls -al | awk 'NR>1{print $9}'} # 为当前目录下的所有文件添加可执行权限
```

<font color="red">**以上命令用法并不重要，知道怎么找到命令的方法才重要，特别记忆的知识，都是你暂时用不到的，我们应该把精力放在学习思想和方法上**</font>

### 1.2.2 bash编程-变量

- 全局变量

```bash
# 无需关键字，等号2变不要有空格
  COURES=ENGINEERING 
 export  COURES=ENGINEERING # 导出
```
- 局部变量

```bash
# 用户函数内,作用域的概念
 local  COURES=ENGINEERING 
```
- 环境变量

```bash
PATH：指定目录的搜索路径
HOME：指定用户的主目录（即登录用户到linux系统中时默认的目录
HISTSIZE：指保存历史命令记录的条数
LOGNAME：指当前用户的登录名
HOSTNAME：指主机的名称，许多应用程序如果要用到主机名的话，通常是从这个环境变量中来取得
SHELL：指当前用户用的是那种shell
LANG/LANGUGE：和语言相关的环境变量，使用多种语言的用户可以修改此环境变量
MAIL：指当前用户的邮件存放系统
```

```bash
# 我们可以在控制台输出，例如
# echo 相当于js的console.log
echo $SHELL
# 结果：/bin/bash
```
我们常说把某个命令加入环境变量中，其实就是加入$PATH环境变量

- 基本类型

```bash
# string
ASRING=abc
ASRING="acs"
# number
ANUMBER=$[1+1]
ANUMBER=$((1+1))
# Array
ANARRAY=（what\'s the day today）
ANARRAY=(1 2 3 4)
ANARRAY[1]=0
```

### 1.2.2 bash编程-运算

-  组合

```bash
ASTRING=abd
ANUMBER=$((1+1))

STR ="The starts $ASTRING"
eacho $STR # The starts abd

SEQ=(1 $ANUMBER 3 4 5)
echo $SEQ # 1 2 3 4 5
```
- 数学运算符

```bash
ANUMBER=$(6+2）
ANUMBER=$(6-2）
ANUMBER=$(6*2）
ANUMBER=$(6/2）
```
### 1.2.3 bash编程-条件语句

- if then

```bash
if conditicon1
then 
   command1
elif conditicon1
then command2
else commandN
fi # 结束关键字
```

- case

```bash
case $VAR in
  condition1)
  command1
  ;;
  condition2)
  echo command2
  ;;
  *)
  acho command3
  ;;
  asac
```
- 比较符

```bash
-z var # 检查变量var是否为空
-d file # 检查file是否存在并是一个目录
-e file # 检查file是否存在
-f file # 检查file是否存在并是一个文件
-r file # 检查file是否存在并可读
-s file # 检查file是否存在并非空
-W file # 检查file是否存在并可写
-X file # 检查file是否存在并可执行
-O file # 检查file是否存在并属于当前用户
-G file # 检查file是否存在并其默认租与当前用户相同
file1 -nt file2 # 检查file1是否比file2新
file1 -ot file2 # 检查file1是否比file2旧
```

### 1.2.3 bash编程-循环语句 

- for循环

```bash
for index in 1 2 3 4 5; do
echo "index="$index
done
for((i=0;i<5;i++));do
echo $i
```
- while循环

```bash
while (($i<=10))do
echo $i
done
```

### 1.2.4 bash编程-循环语句 

 - 函数的定义

```bash
function custom()
{
    # 定义一个变量
    local prefix="input is"
    # $1是否为空
    if [-z $1]; then
       echo “no input”
    else
      echo “$prefix $1”
    fi
    return 0
      
}
# 在函数体中，可以使用$n来获取第n个实参
```

- 函数的调用和返回值

```bash
custom # unknown 调用
custom abc # input is abc 调用并传入abc
echo  $? # 0 $?拿到上一次函数调用的结果
```
shell中运行的每一个命令都使用退出状态码（exit status）来告诉shell它完成了处理，退出状态码是一个0-255
之间的整数值，在命令结束运行时由命令传给shell，可以在命令执行完毕后立即使用$?捕获。

- 其他特殊变量

```bahs
 $# 传递到脚本或函数的参数个数
 $* 以一个单字符串显示所有向脚本传递的参数
 $$ 脚本运行的当前进程ID号
 $! 后台运行的最后一个进程的ID号
 $@ 与$*相同，但是使用时加引号，并在引号中返回每个参数
 $- 显示shell使用的当前选项，与set命令功能相同
 $? 显示最后命令的退出状态，0表示没有错误，其他任何值表明有错误
```

### 1.2.4 bash编程-重定向

- 什么是重定向

  - 重定向，全称I/O重定向，默认情况下，Bash程序从终端接受输入，并在终端打印输出（标准输入，标准输出）
  - 如果你想改变输入的来源，或是输出的目的地，那么就需要使用“重定向”

- 怎么用？只要记住四个符号

```bash
    # 将command命令执行的结果重定向到file中
    command > file # 将输出重定向到file
    # 将file个文件的内容作为command的输入内容
    command < file # 将输入重定向到file
     # 将file个文件的部分内容作为command的输入
    command << file # 将输入重定向到file的部分内容
    # 一般输出log文件
    command >> file # 将输出以追加的方式重定向到file
```

案例：把ls输出到终端的信息输出到一个文件中

```bash
ls # 可以查看当前文件的文件信息
ls > ls.log # 在当前文件夹下生成了一个ls.log文件，文件里的内容是ls输出的信息
ls -al > ls.log # 把ls -al 输出的详细信息输入到ls.log文件中，这种做法会覆盖上一次文件里的内容，我们可以使用>>追加的方式
ls >> ls.log # 会把ls输出的信息放到ls -al 输出信息的后面
```
### 1.2.4 bash编程-交互式程序

- echo和read

```bash
echo “xxx” # 打印并换行
echo -n “xxx” # 打印且不换行
read var # 读取输入，存变量var
read -n 1 var # 读取输入的一个字符，存入变量var
```
案例：可以在终端输入以下命令进行体验

```bash
echo -n "what ur first name？";\
read firstname;\
 echo -n "What's ur second name？";\
read secondname;\
echo "$firstname $secondname";

# 询问你firstname 和 secondname，当你输入后，最后会打印你输出的内容
```
### 1.2.5 扩展学习资料
这是一本全面而详细的介绍Linux操作系统的好书，适合对Linux操作系统有兴趣和需要熟悉Linux环境的同学。

[《鸟哥的Linux私房菜（基础学习篇）》](http://cn.linux.vbird.org/)

这是一本深入浅出的介绍Linux命令和Shell脚本编写的优秀技术书，目前豆瓣评分9.3分。如果你想深入和熟练的掌握Shell编程，希望你不要错过它。

[《The Linux Command Line》](http://linuxcommand.org/tlcl.php  )