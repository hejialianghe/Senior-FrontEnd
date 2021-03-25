## 7.1 Git工程规范

[git文档](http://git-scm.com/book/zh/v2)

### 7.1.1 Git flow规范

在工作中避免不了多人协作，协作避免不了有一个规范的流程，让大家有效的去合作；让项目仅仅有条的发展下去；`git flow`是最早诞生，
并得到广泛采用的一种工作流，git flow采用的是功能驱动式开发。
![](~@/engineering/git-fdd.png)
功能驱动式开发（Feature-driven development，简称FDD）

- 长期分支
  -  master - 主分支
  - develop - 开发分支

- 短期分支
  - feature - 功能分支
  - hotfix - 补丁分支
  - release - 预发分支

| 分支  |  详细介绍  | 
| :---: | :--------: |
|  master  | 产品分支：只能从其他分支合并内容，不能在这个分支直接修改。合并到master上的commmit只能来字release分支或hotfix分支 |
|  develop  | 开发主干分支：基于master的tag建立，主要用来暂时保存开发完成而又未发布的feature分支内容，以及release和hotfix的补充内容 |
|  feature  | 功能分支：一般一个新功能对应一个功能分支，从而和已经完成的功能隔离开来，而且只有在新功能完成开发的情况下，其对应的feature分支才会合并到主开发分支（develop分支）上 | 
|  release  | 预发分支：当需要发布时，我们从develop分支创建一个release分支，然后这个release分支会发布到测试环境进行测试，如果发现问题就在这个分支直接进行修复。发布结束后，这个release分支会合并到develop和master分支，从而保证不会有代码丢失。|
|  hotfix  | 补丁分支：主要用于紧急修复一些bug，会从master分支上的某一个tag建立，修复结束后再合并到develop和master分支上  |

### 7.1.2 Git commit 规范 

#### 为什么要写好 Git Commit?

- 提供更多的历史信息，方便快速浏览
- 可以过滤某些commit（比如文档改动），方便快速查找信息
```bash
  # 过滤日志信息
  git log HEAD --pretty=format:%s --grep 关键字
```
- 可以直接从commit生成Change log

#### 如何优雅地写好Git Commit

业界使用比较广泛的是Angular规范

```html
<type>(<scope>):<subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
- 标题行：必填，描述主要修改类型和内容
- 主要内容：描述为什么修改，做什么样的修改，以及开发的思路等等
- 页脚注释：放 Breaking Changes 或 Closed Issuses

type | commit 类型
| 类型  |  详细介绍  | 
| :---: | :--------: |
| feat  | 新功能、新特性 |
| fix  | bugfix，修改问题 |
| refactor | 代码重构 |
| docs  | 文档修改 |
| style  | 代码格式修改，注意不是css修改 |
| test  | 测试用例修改|
| chore  | 其他修改，比如构建流出，依赖管理 |

scope | commit影响的范围
比如：route、component、utils、build.....
- subject:commit 的概述，建议符合 50/72 formatting
- body：commit 具体修改内容，可以分为多行，建议符合50/72 formatting
- footer：一些备注，通常是BREAKING CHANGE 或 修改的bug链接 

#### 利用插件（commitizen）

```bash
# cz-conventional-changelog changelog插件 
npm install -g commitizen cz-conventional-changelog
# 命令行中输入以下命令，配置到czrc目录下,也可以用vim编辑~/.czrc添加到文件中去{ "path": "cz-conventional-changelog"}
echo '{ "path": "cz-conventional-changelog"}' > ~/.czrc
git cz
```
自定义文档格式,commit用中文去写

```bash
npm install -g customizable
echo '{ "path": "customizable"}' > ~/.czrc
vim .czrc
# 修改成这个内容 { "path": "cz-customizable"}
touch .cz.config.js
git cz
```
gitmoji(趣味图标)

```bash
npm i -g gitmoji-cli
gitmoji -c # git commit 提交
```
## 7.2 Git Hooks

### 7.2.1 git hooks

Git 钩子（hooks）是在Git仓库中特定事件（certain points）触发后被调用的脚本

可以用git init初始化git文件，在.git/hooks下有各种钩子模版，可以用例如less prepare-commit-msg.sample查看文件，里面是一段执行脚本。

- 客户端钩子-> 由诸如提交和合并这样的操作所调用
- 服务端钩子-> 作用于诸如接收被推送的提交这样的联网操作

#### 客户端 Hooks

| 类型  |  详细介绍  |
| :---: | :--------: |
| prepare-commit-msg | commit message编辑器呼起前 default commit message创建后触发，常用于生成默认的标准化的提交说明 |
| commit-msg | 开发者编写完并确认commit message后触发，常用于校验提交说明是否标准 |
| post-commit | 整个git commit完成后触发，常用于邮件通知、提醒 |
| applypatch-msg | git am提取补丁并 应用于当前分支后，准备提交触发，常用于执行测试用例或检查缓冲区代码 |
| pre-applypatch | git am提交后触发，常用于通知、补丁、邮件推送回复（此钩子不能停止git am过程） |
| pre-rebase | 执行git rebase命令时触发 |
| post-rewrite | 执行会替换commit的命令时触发，比如git rebase 或 git cimmit-amend |
| post-checkout | 执行git checkout命令成功后触发，可用于生成特定文档，处理大二进制文件等 |
| post-merge | 成功完成一次merge行为后触发 |
| pre-auto-gc | 执行垃圾回收前触发 |

#### 服务端 Hooks

| 类型  |  详细介绍  |
| :---: | :--------: |
| pre-receive | 当服务端收到一个push操作请求时触发，可用于检测push的内容 |
| update | 与pre-receive相似，但当一次push想更新多个分支时，pre-receive只执行一次，而此钩子会为没一分支都执行一次  |
| post-receive | 当整个push操作完成时触发，常用于服务侧同步、通知 |

### 7.2.2 工程实践

#### Husky

用node实现的的快速安装git hooks的工具

```json
// npm install husky --save-dev
// package.json
{
  "husky" : {
    "hooks": {
       "pre-commit": "npm test",
        // ......
    }
  }
}
```
命令行 less .git/hooks/pre-commit 查看pre-commit文件，可以看见"$(dirname "$0")/husky.sh",然后可以查看less .git/hooks/husky.sh

#### link-staged

只会检测暂存区的文件，不会对所有的文件进行检测，也就是说我修改一个文件，只会检测当前这个文件

```bash
 # 安装代码检测工具
 npm install prettier eslint -D
 # 安装lint-staged
 npx mrm lint-staged
```
```json
{
"gitHooks": {
    "pre-commit": "lint-staged"
  },
{
  "lint-staged": {
    "*.js": "eslint --cache --fix",
    "*.{js,css,md}": "prettier --write"
  }
}
```
### 7.2.3 Git Hooks 拓展学习资料

自定义Git - Git 钩子：https://git-scm.com/book/zh/v2/自定义-Git-Git-钩子

Husky：https://github.com/typicode/husky  

