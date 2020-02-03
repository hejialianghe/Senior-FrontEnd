const path = require("path");
module.exports = {
    title: '高级开发工程师必学',
    description: 'Hello, my friend!',
    dest: "dist",
    serviceWorker: true,
    markdown: {
      lineNumbers: true
    },
    head: [
        ['link', {
            rel: 'icon',
            href: `/logo.jpeg`
        }]
    ],
    dest: 'dist',
    ga: '',
    evergreen: true,
    configureWebpack: {
      resolve: {
        alias: {
          '@': path.join(__dirname, 'public','assets')
        }
      }
    },
    themeConfig: {
      repo: "hejialianghe/seniorFrontEnd",
      editLinks: true,
      docsDir: "docs",
      editLinkText: "在 GitHub 上编辑此页",
      lastUpdated: "最新更新时间",
      sidebarDepth: 1,
        sidebar:[
            {
              title: "指南",
              collapsable: false,
              children: [
                ["guide/",'介绍']
              ]
            },
            {
                title: "JavaScript进阶",
                collapsable: false,
                children: [
                  ["jsadvanced/",'导学'],
                  ["jsadvanced/function",'函数'],
                  ["jsadvanced/asyncpro",'异步编程'],
                  ["jsadvanced/designpattern",'设计模式'],
                ]
              },
              {
                title: "计算机网络",
                collapsable: false,
                children: [
                  ["computerNetwork/",'网络协议'],
                  ["computerNetwork/",'网络请求'],
                  ["computerNetwork/",'网络安全'],
                  ["computerNetwork/",'模块加载'],
                  ["computerNetwork/",'路由']
                ]
              },
              {
                title: "Vue",
                collapsable: false,
                children: [
                  ["vue/",'前言'],
                  ["vue/",'探索vue的组件世界'],
                  ["vue/",'vue生态'],
                  ["vue/",'vue实战'],
                  ["vue/",'企业级组件系统架构'],
                  ["vue/",'Vue3.0']
                ]
              },
              {
                title: "Vue2.0源码",
                collapsable: false,
                children: [
                  ["vue2.0/",'前言'],
                  ["vue2.0/dataResponse",'响应式']
                ]
              },
              {
                title: "react",
                collapsable: false,
                children: [
                  ["react/",'入门介绍'],
                  ["react/",'JSX介绍'],
                  ["react/",'组件基础知识'],
                  ["react/",'组件进阶'],
                  ["react/",'实战应用1'],
                  ["react/",'react生态-路由'],
                  ["react/",'react生态-企业应用'],
                  ["react/",'react原理'],
                  ["react/",'react-hooks'],
                  ["react/",'react高级实战与性能优化'],
                  ["react/",'状态管理'],
                  ["react/",'实战应用2']
                ]
              },
              {
                title: "Node.js进阶",
                collapsable: false,
                children: [
                  ["node/",'Node.js基础'],
                  ["node/",'Web服务及koa'],
                  ["node/",'企业级Nodejs框架'],
                ]
              },
              {
                title: "工程化",
                collapsable: false,
                children: [
                  ["engineering/",'脚本世界'],
                  ["engineering/",'规范先行'],
                  ["engineering/",'质量代码'],
                  ["engineering/",'工程设计'],
                  ["engineering/",'构建艺术'],
                  ["engineering/",'持续集成与部署'],
                  ["engineering/",'Git操作'],
                  ["engineering/",'效率工具']
                ]
              },
              {
                title: "项目实战",
                collapsable: false,
                children: [
                  ["projectPractice/",'认识同构及原理'],
                  ["projectPractice/",'实现一个同步的demo'],
                  ["projectPractice/",'同构如何获取数据'],
                  ["projectPractice/",'Nextjs'],
                  ["projectPractice/",'同构如何获取数据']
                ]
              }
        ]
    }
}