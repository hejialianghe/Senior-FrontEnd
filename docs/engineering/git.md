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
  - feature - 功能分支‘
  - hotfix - 补丁分支
  - release - 预发分支

| 分支  |  详细介绍  | 
| :---: | :--------: |
|  master  | 产品分支：只能从其他分支合并内容，不能在这个分支直接修改。合并到master上的commmit只能来字release分支或hotfix分支 |  
